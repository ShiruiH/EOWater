#==========================================================#
# Utilities
#==========================================================#

# Kilian Vos DPE 2023

import os
import pickle 
import zipfile
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from skimage import morphology, transform
import csv
import pytz
import json

class Configuration:
    def __init__(self):
        self.paths = {}
        self.settings = {}
    
    def list_paths(self):
        for key in self.paths.keys():
            print('%s'%key)
            
    def list_paths_full(self):
        for key in self.paths.keys():
            print('%s -> %s'%(key,self.paths[key]))
        
    def list_settings(self):
        for key in self.settings.keys():
            print('%s: %s'%(key,self.settings[key]))

    def add_path(self, name, path):
        self.paths[name] = path
        if not os.path.exists(path) and not '.' in path:
            os.makedirs(path)
            
    def save_settings(self,path):
        with open(path, "w") as f:
            json.dump(self.settings, f, indent=4)
            
def save_pickle(path, variable):
    with open(path, "wb") as f:
        pickle.dump(variable, f)
        
def load_pickle(path):
    with open(path, "rb") as f:
        variable = pickle.load(f)
    return variable

def plot_image(im):
    fig, ax = plt.subplots(1,1,figsize=[12,8],tight_layout=True)
    ax.grid(which="major", ls=":", c="0.5")
    ax.set(xlabel='',ylabel='')
    ax.imshow(im)

def reproject(gdf, epsg):
    print("coordinates are in epsg:%d" % gdf.crs.to_epsg())
    if not gdf.crs.to_epsg() == epsg:
        gdf_reproj = gdf.to_crs(epsg=epsg)
        print("coordinates converted to in epsg:%d" % gdf_reproj.crs.to_epsg())
    else:
        gdf_reproj = gdf
    return gdf_reproj

def write_dict_to_csv(dictionary, csv_file):
    'write dictionary into a csv file'
    with open(csv_file, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['OFS_ID', 'label'])
        for key, value in dictionary.items():
            csv_writer.writerow([key, value])
            
def convert_world2pix(points, georef):
    """
    Converts world projected coordinates (X,Y) to image coordinates 
    (pixel row and column) performing an affine transformation.
    
    KV WRL 2018

    Arguments:
    -----------
    points: np.array or list of np.array
        array with 2 columns (X,Y)
    georef: np.array
        vector of 6 elements [Xtr, Xscale, Xshear, Ytr, Yshear, Yscale]
                
    Returns:    
    -----------
    points_converted: np.array or list of np.array 
        converted coordinates (pixel row and column)
    
    """
    
    # make affine transformation matrix
    aff_mat = np.array([[georef[1], georef[2], georef[0]],
                       [georef[4], georef[5], georef[3]],
                       [0, 0, 1]])
    # create affine transformation
    tform = transform.AffineTransform(aff_mat)
    
    # if list of arrays
    if type(points) is list:
        points_converted = []
        # iterate over the list
        for i, arr in enumerate(points): 
            points_converted.append(tform.inverse(points))
            
    # if single array    
    elif type(points) is np.ndarray:
        points_converted = tform.inverse(points)
        
    else:
        print('invalid input type')
        raise
        
    return points_converted

def duplicates_dict(lst):
    "return duplicates and indices"
    def duplicates(lst, item):
            return [i for i, x in enumerate(lst) if x == item]

    return dict((x, duplicates(lst, x)) for x in set(lst) if lst.count(x) > 1)   

def monthly_max(dates, chainages):
    # define the 12 months
    months = ['-%02d'%_ for _ in np.arange(1,13)]
    seasons = np.arange(1,13)
    season_labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    # put time-series into a pd.dataframe (easier to process)
    df = pd.DataFrame({'dates': dates, 'area':chainages})
    df.set_index('dates', inplace=True) 
    # initialise variables for seasonal averages
    dict_seasonal = dict([])
    for k,j in enumerate(seasons):
        dict_seasonal[season_labels[k]] = {'dates':[], 'area':[]}
    dates_seasonal = []
    chainage_seasonal = []
    season_ts = []
    for year in np.unique(df.index.year):
        # 4 seasons: DJF, MMA, JJA, SON
        for k,j in enumerate(seasons):
            # middle date
            date_seas = pytz.utc.localize(datetime(year,j,15))
            if date_seas > dates[-1]:
                break
            try:
                chain_seas = np.array(df[str(year)+months[k]:str(year)+months[k]]['area'])
            except:
                continue
            if len(chain_seas) == 0:
                continue
            else:
                dict_seasonal[season_labels[k]]['dates'].append(date_seas)
                dict_seasonal[season_labels[k]]['area'].append(np.max(chain_seas))
                dates_seasonal.append(date_seas)
                chainage_seasonal.append(np.max(chain_seas))
                season_ts.append(j)
    # convert chainages to np.array (easier to manipulate than a list)
    for seas in dict_seasonal.keys():
         dict_seasonal[seas]['area'] = np.array(dict_seasonal[seas]['area'])
                
    return dict_seasonal, dates_seasonal, np.array(chainage_seasonal), np.array(season_ts)

def monthly_mean(dates, chainages):
    # define the 12 months
    months = ['-%02d'%_ for _ in np.arange(1,13)]
    seasons = np.arange(1,13)
    season_labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    # put time-series into a pd.dataframe (easier to process)
    df = pd.DataFrame({'dates': dates, 'area':chainages})
    df.set_index('dates', inplace=True) 
    # initialise variables for seasonal averages
    dict_seasonal = dict([])
    for k,j in enumerate(seasons):
        dict_seasonal[season_labels[k]] = {'dates':[], 'area':[]}
    dates_seasonal = []
    chainage_seasonal = []
    season_ts = []
    for year in np.unique(df.index.year):
        # 4 seasons: DJF, MMA, JJA, SON
        for k,j in enumerate(seasons):
            # middle date
            date_seas = pytz.utc.localize(datetime(year,j,15))
            if date_seas > dates[-1]:
                break
            try:
                chain_seas = np.array(df[str(year)+months[k]:str(year)+months[k]]['area'])
            except:
                continue
            if len(chain_seas) == 0:
                continue
            else:
                dict_seasonal[season_labels[k]]['dates'].append(date_seas)
                dict_seasonal[season_labels[k]]['area'].append(np.mean(chain_seas))
                dates_seasonal.append(date_seas)
                chainage_seasonal.append(np.mean(chain_seas))
                season_ts.append(j)
    # convert chainages to np.array (easier to manipulate than a list)
    for seas in dict_seasonal.keys():
         dict_seasonal[seas]['area'] = np.array(dict_seasonal[seas]['area'])
                
    return dict_seasonal, dates_seasonal, np.array(chainage_seasonal), np.array(season_ts)

def convert_climate_index_to_df(df):
    dates = []
    values = []
    months = [datetime(1,i,1).strftime('%m') for i in range(1,13)]
    for i in df.index:
        row = df.loc[i]
        for j in range(len(months)):
            try: 
                value = float(row[j])
            except:
                value = float(row[j][:6])
            date = pytz.utc.localize(datetime(i,j+1,1))
            if np.isnan(value):
                continue
            dates.append(date)
            values.append(value)    
    return dates, values

def get_min_max(y):
    'get min and max of a time-series'
    ymin = np.nanmin(y)
    ymax = np.nanmax(y)
    ymax = np.max([np.abs(ymin),np.abs(ymax)])
    ymin = -np.max([np.abs(ymin),np.abs(ymax)])
    return [ymin,ymax]