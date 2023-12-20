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

def reject_outliers(dates, chainage, satnames, max_change):
    'Function to despike time-series based on a percentage change'
    # remove outliers
    chainage_temp = copy.deepcopy(list(chainage))
    dates_temp = copy.deepcopy(dates)
    satnames_temp = copy.deepcopy(satnames)
    
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
                    satnames_temp.pop(k)
                    break
                
            # check if the last point is an outlier
            elif k == len(chainage_temp)-1:
                # difference between last and before last point in the time-series
                diff = chainage_temp[k] - chainage_temp[k-1]
                if np.abs(diff) > 2*max_change:
                    chainage_temp.pop(k)  
                    dates_temp.pop(k)
                    satnames_temp.pop(k)
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
                    satnames_temp.pop(k)
                    break
        # if one full loop is completed (went through all the time-series without removing outlier)
        # then increment k to get out of the loop
        k = k + 1
    
    return dates_temp, np.array(chainage_temp), satnames_temp

#%% Load data

# load polygon layer (the one that has both the new and old UNIQUEIDs in attribute table)
epsg = 32755
fp_polygons = os.path.join(os.getcwd(),'shared_with_NGIS','OFS_layer_NGIS','validation_OFS_forNGIS_2.geojson')
gdf_OFS = gpd.read_file(fp_polygons, driver="GeoJSON")
N = len(gdf_OFS)
print('%d polygons loaded'%N)
gdf_OFS = reproject(gdf_OFS, epsg)

# folder with NGIS CSV files
fp_data = os.path.join(os.getcwd(),'NGIS_data','CSV_NGIS')

# folder in which to save the outputs
fp_ngis_ts = os.path.join(os.getcwd(),'NGIS_data','ts_NGIS_newBaselayer')
if not os.path.exists(fp_ngis_ts): os.makedirs(fp_ngis_ts)

# initialise df
df_ngis = pd.DataFrame()

# load NGIS S2
fn_file = os.path.join(fp_data,'S2_OFS_Vali_2015_2023_8Y_newBaseLayer.csv') 
fn = os.path.join(fn_file)
df_S2 = pd.read_csv(fn, parse_dates=['system_time_utc'])
df_S2['date'] = df_S2['system_time_utc']
df_S2['satname'] = ['S2' for _ in range(len(df_S2))]
df_ngis = pd.concat([df_S2,df_ngis], axis=0)

# load NGIS L5
fn_file = os.path.join(fp_data,'L5_OFS_Vali_1986_2013_28Y_newBaseLayer.csv') 
fn = os.path.join(fn_file)
df_L5 = pd.read_csv(fn, parse_dates=['system_time_utc'])
df_L5['date'] = df_L5['system_time_utc']
df_L5['satname'] = ['L5' for _ in range(len(df_L5))]
df_ngis = pd.concat([df_L5,df_ngis], axis=0)

# load NGIS L7
fn_file = os.path.join(fp_data,'L7_OFS_Vali_1999_2023_25Y_newBaseLayer.csv') 
fn = os.path.join(fn_file)
df_L7 = pd.read_csv(fn, parse_dates=['system_time_utc'])
df_L7['date'] = df_L7['system_time_utc']
df_L7['satname'] = ['L7' for _ in range(len(df_L7))]
df_ngis = pd.concat([df_L7,df_ngis], axis=0)

# load NGIS L8
fn_file = os.path.join(fp_data,'L8_OFS_Vali_2013_2023_11Y_newBaseLayer.csv') 
fn = os.path.join(fn_file)
df_L8 = pd.read_csv(fn, parse_dates=['system_time_utc'])
df_L8['date'] = df_L8['system_time_utc']
df_L8['satname'] = ['L8' for _ in range(len(df_L8))]
df_ngis = pd.concat([df_L8,df_ngis], axis=0)

# postprocess into a single array
df_ngis.pop('system_time_utc')
df_ngis.pop('dates')
dates_all = [df_ngis.iloc[_]['date'].to_pydatetime() for _ in range(len(df_ngis))]
df_ngis['date'] = dates_all
area_all = np.array(df_ngis['area'])
satnames_all = list(df_ngis['satname'])

# go for each UNIQUEID of the new baselayer
site_ids = np.unique(list(gdf_OFS['UNIQUEID_new']))
for site_id in site_ids:
    
    if site_id == 'nan': continue
    
    # load the time-series for that UNIQUEID
    idx = np.where(df_ngis['UNIQUEID'] == site_id)[0]
    dates_ngis = [dates_all[_] for _ in idx]
    area_ngis = np.array([area_all[_] for _ in idx])/1e4
    satnames = [satnames_all[_] for _ in idx]
    # sort by date
    idx_sort = np.argsort(dates_ngis)
    dates_ngis = [dates_ngis[_] for _ in idx_sort]
    area_ngis = area_ngis[idx_sort]
    satnames = [satnames[_] for _ in idx_sort]
    
    # get area of polygon geometry
    polygon = gdf_OFS.loc[gdf_OFS['UNIQUEID_new'] == site_id]
    sitename = polygon.iloc[0]['Full_ID']
    polygon_geom = polygon.iloc[0].geometry.geoms[0]
    polygon_area = polygon_geom.area/1e4
    max_change = 0.3*polygon_area
    
    # step 1: reject outliers
    dates_ngis2, area_ngis2, satnames2 = reject_outliers(dates_ngis, area_ngis,satnames, max_change)
    print('%d outliers removed - %s'%(len(dates_ngis)-len(dates_ngis2),site_id))    
    
    # step 2: clip to polygon area
    area_ngis2[area_ngis2 > polygon_area] = polygon_area

    # find UNIQUEID of the old layer to save with same filename as previously
    site_id_old = polygon.iloc[0]['UNIQUEID']
    
    # save the csv
    df_site = pd.DataFrame({'dates':dates_ngis2,'area (Ha)':area_ngis2, 'satname':satnames2})
    df_site.to_csv(os.path.join(fp_ngis_ts,'%s_area_timeseries.csv'%site_id_old),index=False)