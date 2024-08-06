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
import matplotlib.lines as mlines
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


#%% Load data

plt.ioff()
# compare with our S2 time-series
fp_comparison = os.path.join(os.getcwd(),'comparison_plots_all', 'all_sensors')
if not os.path.exists(fp_comparison): os.makedirs(fp_comparison)

# load time-series
fp_ts1 = os.path.join(os.getcwd(),'area_csv')
fp_ts2 = os.path.join(os.getcwd(),'ts_NGIS')

filenames = os.listdir(fp_ts1)
for i,fn in enumerate(filenames):
    site_id = fn[:9]
    # load csv file with time-series
    df1 = pd.read_csv(os.path.join(fp_ts1,fn))
    dates1 = [pd.to_datetime(_).to_pydatetime() for _ in df1['dates']]
    area1 = np.array(df1['area (Ha)'])
    
    df2 = pd.read_csv(os.path.join(fp_ts2,fn))
    dates2 = [pd.to_datetime(_).to_pydatetime() for _ in df2['dates']]
    area2 = np.array(df2['area (Ha)'])
    
    if len(area2) == 0: continue

    # calculate error statistics by interpolating our dates around NGIS dates (more sparse)
    x1 = [_.toordinal() for _ in dates1]
    x2 = [_.toordinal() for _ in dates2]
    f = interpolate.interp1d(x1, area1, bounds_error=False, fill_value=np.nan, assume_sorted=True)
    y1 = f(x2)
    y2 = area2
    error = y1 - y2
    n = len(error)
    std = np.nanstd(error)
    rmse = np.sqrt(np.nanmean((error) ** 2))
    bias = np.nanmean(error)
    
    # make time-series plot
    fig, ax = plt.subplots(1,1,figsize=[12,4],tight_layout=True)
    ax.grid(which="major",axis='both', ls="--", c="0.5")
    ax.set(ylabel='area (Ha)', title='Water area time-series - %s'%(site_id))
            # ylim=[-0.03*polygon_area,polygon_area*(1+0.03)])
    ax.plot(dates1,area1,'C0-o',mfc='w',ms=4,label='DPE (n=%d)'%(len(dates1)))
    ax.plot(dates2,area2,'C1-o',mfc='w',ms=4, label='NGIS (n=%d)'%(len(dates2)))
    # ax.axhline(y=polygon_area,ls='--',c='k',label='polygon area: %.1f Ha'%polygon_area)
    ax.legend(loc='upper left')
    # plot percentage
    # ax2 = ax.twinx()
    # ax2.grid(which="major", ls="--", lw=1,c="0.5")
    # ax2.set(ylabel='% Area',ylim=[-3,103])
    # ax.set_zorder(ax2.get_zorder()+1)
    # ax.set_facecolor('none')
    str_stats = " Bias = %.2f\n RMSE = %.2f\n STD = %.2f\n n = %d" % (bias,rmse,std,n,)
    ax.text(0.0,0.25,str_stats,va="top",transform=ax.transAxes,fontsize=11,
            bbox=dict(boxstyle="square", ec="k", fc="w", alpha=1))
    fig.savefig(os.path.join(fp_comparison,'%s.jpg'%(site_id)),dpi=200)
    plt.close(fig)

#%% Comparison per satellite

# compare with our S2 time-series
for sat in ['L5','L7','S2']:
    fp_comparison = os.path.join(os.getcwd(),'comparison_plots_all','comparison_%s'%sat)
    if not os.path.exists(fp_comparison): os.makedirs(fp_comparison)

# load time-series
fp_ts1 = os.path.join(os.getcwd(),'area_csv')
filenames = os.listdir(fp_ts1)

fp_ts2 = os.path.join(os.getcwd(),'ts_NGIS')

for i,fn in enumerate(filenames):
    site_id = fn[:9]
    # load csv file with time-series
    df1 = pd.read_csv(os.path.join(fp_ts1,fn))
    dates1 = [pd.to_datetime(_).to_pydatetime() for _ in df1['dates']]
    area1 = np.array(df1['area (Ha)'])
    sat1 = df1['satname']
    df2 = pd.read_csv(os.path.join(fp_ts2,fn))
    dates2 = [pd.to_datetime(_).to_pydatetime() for _ in df2['dates']]
    area2 = np.array(df2['area (Ha)'])
    sat2 = df2['satname']
    
    for sat in ['L5','L7','S2']:
        fp_comparison = os.path.join(os.getcwd(),'comparison_plots_all','comparison_%s'%sat)
        
        idx_sat1 = np.where([_ == sat for _ in sat1])[0]
        area_sat1 = area1[idx_sat1]
        dates_sat1 = [dates1[_] for _ in idx_sat1]
        
        idx_sat2 = np.where([_ == sat for _ in sat2])[0]
        area_sat2 = area2[idx_sat2]
        dates_sat2 = [dates2[_] for _ in idx_sat2]
        
        if len(area_sat2) == 0 or len(area_sat1) == 0: continue
    
        # calculate error statistics by interpolating our dates around NGIS dates (more sparse)
        x1 = [_.toordinal() for _ in dates_sat1]
        x2 = [_.toordinal() for _ in dates_sat2]
        f = interpolate.interp1d(x1, area_sat1, bounds_error=False, fill_value=np.nan, assume_sorted=True)
        y1 = f(x2)
        y2 = area_sat2
        error = y1 - y2
        n = len(error)
        std = np.nanstd(error)
        rmse = np.sqrt(np.nanmean((error) ** 2))
        bias = np.nanmean(error)
        
        # make time-series plot
        fig, ax = plt.subplots(1,1,figsize=[12,4],tight_layout=True)
        ax.grid(which="major",axis='both', ls="--", c="0.5")
        ax.set(ylabel='area (Ha)', title='%s water area time-series - %s'%(sat,site_id))
                # ylim=[-0.03*polygon_area,polygon_area*(1+0.03)])
        ax.plot(dates_sat1,area_sat1,'C0-o',mfc='w',ms=4,label='DPE (n=%d)'%(len(dates_sat1)))
        ax.plot(dates_sat2,area_sat2,'C1-o',mfc='w',ms=4, label='NGIS (n=%d)'%(len(dates_sat2)))
        # ax.axhline(y=polygon_area,ls='--',c='k',label='polygon area: %.1f Ha'%polygon_area)
        ax.legend(loc='upper left')
        # plot percentage
        # ax2 = ax.twinx()
        # ax2.grid(which="major", ls="--", lw=1,c="0.5")
        # ax2.set(ylabel='% Area',ylim=[-3,103])
        # ax.set_zorder(ax2.get_zorder()+1)
        # ax.set_facecolor('none')
        str_stats = " Bias = %.2f\n RMSE = %.2f\n STD = %.2f\n n = %d" % (bias,rmse,std,n,)
        ax.text(0.0,0.25,str_stats,va="top",transform=ax.transAxes,fontsize=11,
                bbox=dict(boxstyle="square", ec="k", fc="w", alpha=1))
        fig.savefig(os.path.join(fp_comparison,'%s.jpg'%(site_id)),dpi=200)
        plt.close(fig)

#%% Plot coloured per satellite
plt.ion()
fp_comparison = os.path.join(os.getcwd(),'comparison_plots_all','plots_DPE_coloured_per_satellite')
if not os.path.exists(fp_comparison): os.makedirs(fp_comparison)

# load time-series
# fp_ts = os.path.join(os.getcwd(),'ts_NGIS')
fp_ts = os.path.join(os.getcwd(),'area_csv')

satprops = {'S2':{'color':'C0'},
            'L8':{'color':'C1'},
            'L7':{'color':'C2'},
            'L5':{'color':'C3'},
            'L9':{'color':'C4'}}
for i,fn in enumerate(filenames):
    site_id = fn[:9]
    # load csv file with time-series
    df = pd.read_csv(os.path.join(fp_ts,fn))
    dates = [pd.to_datetime(_).to_pydatetime() for _ in df['dates']]
    area = np.array(df['area (Ha)'])
    satnames = df['satname']
    
    # make time-series plot
    fig, ax = plt.subplots(1,1,figsize=[12,4],tight_layout=True)
    ax.grid(which="major",axis='x', ls="--", c="0.5")
    ax.set(ylabel='area (Ha)', title='Water area time-series (n = %d) - %s'%(len(dates),site_id))
           #ylim=[-0.03*polygon_area,polygon_area*(1+0.03)])
    # ax.plot(output['dates'],output['water_area'],'C0-o',mfc='w')
    ax.plot(dates,area,'k-',mfc='w')
    for s in np.unique(satnames):
        idx_satname = np.where([_ == s for _ in satnames])[0]
        dates_satname =  [dates[_] for _ in idx_satname]
        area_satname = [area[_] for _ in idx_satname]
        ax.plot(dates_satname,area_satname,'ko',mfc=satprops[s]['color'],ms=5,)
    legend = []
    for s in np.unique(satnames):
        legend.append(mlines.Line2D([],[],ls='none',marker='o',mec='k',mfc=satprops[s]['color'], label=s))
    # legend.append(mlines.Line2D([],[],ls='none',marker='o',mec='k',mfc='none', label='outlier'))
    ax.legend(handles=legend,loc='upper left', fontsize=10)
    # plot percentage
    ax2 = ax.twinx()
    ax2.grid(which="major", ls="--", lw=1,c="0.5")
    ax2.set(ylabel='% Area',ylim=[-3,103])
    fig.savefig(os.path.join(fp_comparison,'%s.jpg'%(site_id)),dpi=200)
    # plt.close(fig)