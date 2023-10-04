# Code to test water surface area extraction

#%% Initial settings
# load libraries
import os
import pdb
import pickle
import shutil
from datetime import datetime, timedelta
import pytz
import copy
import json

import numpy as np
from scipy import interpolate, stats
import geopandas as gpd
import pandas as pd
from shapely import geometry

# ignore annoying warnings
import warnings
warnings.filterwarnings("ignore")

# plotting modules
import matplotlib.pyplot as plt
from matplotlib import gridspec
import matplotlib.patches as mpatches
import matplotlib.colors as mcolors
from mpl_toolkits.axes_grid1 import make_axes_locatable

plt.ion()
# matplotlib params
plt.style.use("default")
plt.rcParams["font.size"] = 14
plt.rcParams["xtick.labelsize"] = 12
plt.rcParams["ytick.labelsize"] = 12
plt.rcParams["axes.titlesize"] = 12
plt.rcParams["axes.labelsize"] = 12
plt.rcParams["legend.fontsize"] = 12

# functions
def reproject(gdf, epsg):
    'function to reproject geospatial layer'
    print("coordinates are in epsg:%d" % gdf.crs.to_epsg())
    if not gdf.crs.to_epsg() == epsg:
        gdf_reproj = gdf.to_crs(epsg=epsg)
        print("coordinates converted to in epsg:%d" % gdf_reproj.crs.to_epsg())
    else:
        gdf_reproj = gdf
    return gdf_reproj

def reject_outliers(dates, chainage, max_change):
    'Function to despike time-series based on a percentage change'
    # remove outliers
    chainage_temp = copy.deepcopy(list(chainage))
    dates_temp = copy.deepcopy(dates)
    
    # loop through the time-series always starting from the start
    # when an outlier is found, remove it and restart
    # repeat until no more outliers are found in the time-series
    k = 0
    while k < len(chainage_temp):
        for k in range(len(chainage_temp)):
            # check if the first point is an outlier
            if k == 0:
                # difference between 1st and 2nd point in the time-series
                diff = chainage_temp[k] - chainage_temp[k+1]
                if np.abs(diff) > 2*max_change:
                    chainage_temp.pop(k)  
                    dates_temp.pop(k)
                    break
                
            # check if the last point is an outlier
            elif k == len(chainage_temp)-1:
                # difference between last and before last point in the time-series
                diff = chainage_temp[k] - chainage_temp[k-1]
                if np.abs(diff) > 2*max_change:
                    chainage_temp.pop(k)  
                    dates_temp.pop(k) 
                    break
                
            # check if a point is an isolated outlier
            else:  
                # calculate the difference with the data point before and after
                diff_m1 = chainage_temp[k] - chainage_temp[k-1]
                diff_p1 = chainage_temp[k] - chainage_temp[k+1]
                # remove point if isolated outlier, distant from both neighbours
                condition1 = np.abs(diff_m1) > max_change
                condition2 = np.abs(diff_p1) > max_change
                
                # check that distance from neighbours has the same sign 
                condition3 = np.sign(diff_p1) == np.sign(diff_m1)
                if np.logical_and(np.logical_and(condition1,condition2),condition3):
                    chainage_temp.pop(k)  
                    dates_temp.pop(k) 
                    break
        # if one full loop is completed (went through all the time-series without removing outlier)
        # then increment k to get out of the loop
        k = k + 1
    
    return dates_temp, np.array(chainage_temp)

#%% Load data

# load polygon layer
epsg = 32755
fp_polygons = os.path.join(os.getcwd(),'OFS_layer_NGIS','validation_OFS_forNGIS.geojson')
gdf_OFS = gpd.read_file(fp_polygons, driver="GeoJSON")
N = len(gdf_OFS)
print('%d polygons loaded'%N)
gdf_OFS = reproject(gdf_OFS, epsg)

# load NGIS csv file
fp_ngis = os.path.join(os.getcwd(), 'OFS_data_20182023.csv')
df_ngis = pd.read_csv(fp_ngis, parse_dates=['date'])
df_ngis.pop('.geo')
df_ngis.pop('system:index')
dates_ngis = [df_ngis.iloc[_]['date'].to_pydatetime() for _ in range(len(df_ngis))]
df_ngis['date'] = dates_ngis

# compare with our S2 time-series
fp_comparison = os.path.join(os.getcwd(),'comparison_plots')
if not os.path.exists(fp_comparison): os.makedirs(fp_comparison)
site_ids = np.unique(list(df_ngis['UNIQUEID']))
for site_id in site_ids:
    idx = np.where(df_ngis['UNIQUEID'] == site_id)[0]
    dates_ngis = [pytz.utc.localize(df_ngis['date'][_].to_pydatetime()) for _ in idx]
    area_ngis = np.array([df_ngis['area'][_] for _ in idx])/1e4
    
    # load csv file with our time-series
    fp_csv = os.path.join(os.getcwd(),'area_csv','%s_area_timeseries.csv'%site_id)
    if not os.path.exists(fp_csv): continue
    df_site = pd.read_csv(fp_csv)
    dates = [pd.to_datetime(_).to_pydatetime() for _ in df_site['dates']]
    area = np.array(df_site['area (Ha)'])
    
    # get area of polygon geometry
    polygon = gdf_OFS.loc[gdf_OFS['UNIQUEID'] == site_id]
    sitename = polygon.iloc[0]['Full_ID']
    polygon_geom = polygon.iloc[0].geometry.geoms[0]
    polygon_area = polygon_geom.area/1e4
    max_change = 0.3*polygon_area
    
    # step 1: reject outliers
    dates_ngis2, area_ngis2 = reject_outliers(dates_ngis, area_ngis, max_change)
    idx_removed = np.where([not _ in dates_ngis2 for _ in dates_ngis])[0]
    print('%d outliers removed - %s'%(len(idx_removed),sitename))    
    
    # step 2: clip to polygon area
    area_ngis2[area_ngis2 > polygon_area] = polygon_area

    # calculate error statistics by interpolating our dates around NGIS dates (more sparse)
    x = [_.toordinal() for _ in dates]
    x_ngis = [_.toordinal() for _ in dates_ngis2]
    f = interpolate.interp1d(x, area, bounds_error=False, fill_value=np.nan, assume_sorted=True)
    y = f(x_ngis)
    y_ngis = area_ngis2
    error = y - y_ngis
    n = len(error)
    std = np.nanstd(error)
    rmse = np.sqrt(np.nanmean((error) ** 2))
    bias = np.nanmean(error)
    
    # make time-series plot
    fig, ax = plt.subplots(1,1,figsize=[12,4],tight_layout=True)
    ax.grid(which="major",axis='x', ls="--", c="0.5")
    ax.set(ylabel='area (Ha)', title='Water area time-series - %s - %s'%(site_id,sitename),
            ylim=[-0.03*polygon_area,polygon_area*(1+0.03)])
    ax.plot(dates,area,'C0-o',mfc='w',ms=4,label='DPE')
    ax.plot(dates_ngis2,area_ngis2,'C1-o',mfc='w',ms=4, label='NGIS')
    ax.axhline(y=polygon_area,ls='--',c='k',label='polygon area: %.1f Ha'%polygon_area)
    ax.legend(loc='upper left')
    # plot percentage
    ax2 = ax.twinx()
    ax2.grid(which="major", ls="--", lw=1,c="0.5")
    ax2.set(ylabel='% Area',ylim=[-3,103])
    ax.set_zorder(ax2.get_zorder()+1)
    ax.set_facecolor('none')
    str_stats = " Bias = %.2f\n RMSE = %.2f\n STD = %.2f\n n = %d" % (bias,rmse,std,n,)
    ax.text(0.02,0.25,str_stats,va="top",transform=ax.transAxes,fontsize=11,
            bbox=dict(boxstyle="square", ec="k", fc="w", alpha=1))
    fig.savefig(os.path.join(fp_comparison,'%s_%s.jpg'%(sitename,site_id)),dpi=200)
    plt.close(fig)
