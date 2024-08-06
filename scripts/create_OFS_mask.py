# Script to create polygon mask based on OFS layer for a Sentinel-2 tile

#%% Initial settings

import os
import numpy as np
import csv
import shutil
import zipfile

# plotting modules
import matplotlib.pyplot as plt
from matplotlib import colors

# ignore annoying warnings
import warnings
warnings.filterwarnings("ignore")

# geoprocessing modules
from skimage import morphology, transform
from skimage.draw import polygon2mask
from osgeo import gdal
from osgeo import osr
import geopandas as gpd
import rasterio
from rasterio.transform import from_origin

# few auxiliary functions
def write_dict_to_csv(dictionary, csv_file):
    'write dictionary into a csv file'
    with open(csv_file, 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['OFS_ID', 'label'])
        for key, value in dictionary.items():
            csv_writer.writerow([key, value])
def reproject(gdf, epsg):
    'reproject geodataframe to another epsg code'
    print("coordinates are in epsg:%d" % gdf.crs.to_epsg())
    if not gdf.crs.to_epsg() == epsg:
        gdf_reproj = gdf.to_crs(epsg=epsg)
        print("coordinates converted to in epsg:%d" % gdf_reproj.crs.to_epsg())
    else:
        gdf_reproj = gdf
    return gdf_reproj

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


#%% Set parameters
fp_inputs = os.path.join(os.pardir,'inputs')
fp_outputs = os.path.join(os.pardir,'outputs')
LABEL_MULTIPLE = 5      # Multiple by which to multiply the labels

# fp_layer = os.path.join(fp_inputs,'NRAR_FPH_OFS_Details_28355.geojson')
# gdf = gpd.read_file(fp_layer)
# gdf['UNIQUEID'] = ['OFS_%05d'%_ for _ in np.arange(1,len(gdf)+1)]
# columns = ['UNIQUEID','Valley_ID','EOI_No','Full_ID','NRAR_OFS_ID','geometry']
# gdf = gdf[columns]
# gdf.to_file(os.path.join(fp_inputs,'NRAR_FPH_OFS_Details_28355_simple.geojson'), driver='GeoJSON', encoding='utf-8')

#%% Generate masks for Landsat

# load vector file
fp_layer = os.path.join(fp_inputs,'NRAR_FPH_OFS_Details_28355_buffer_10m.geojson')
gdf = gpd.read_file(fp_layer)
gdf['UNIQUEID'] = ['OFS_%05d'%_ for _ in np.arange(1,len(gdf)+1)]

# read Landsat tiles
fp_tiles = os.path.join(fp_inputs,'Landsat_tiles')
fn_tiles = os.listdir(fp_tiles)

fp_out_tiles = os.path.join(fp_outputs,'Landsat_tiles_10m_shifted')
if not os.path.exists(fp_out_tiles): os.makedirs(fp_out_tiles)

for fn_tile in fn_tiles:
    # load tile
    fp_im = os.path.join(fp_tiles,fn_tile)
    data = gdal.Open(fp_im, gdal.GA_ReadOnly)
    georef = np.array(data.GetGeoTransform())
    bands = [data.GetRasterBand(k + 1).ReadAsArray() for k in range(data.RasterCount)]
    im = bands[0]
    proj = osr.SpatialReference(wkt=data.GetProjection())
    epsg_image = int(proj.GetAttrValue('AUTHORITY',1))
    print('Image EPSG:%d'%epsg_image)
    
    # reproject vector layer to EPSG of tile
    gdf = reproject(gdf,epsg_image)
    
    # initialise mask with zeros
    im0 = np.zeros(im.shape)
    # initialise dictionary with labels
    labels = {}
    # loop through polygons
    for i in range(len(gdf)):
        print('\rAdding polygon %d/%d' % (i+1, len(gdf)), end='')
        label = (i+1)*LABEL_MULTIPLE
        ofs = gdf.iloc[i]
        # add label to dictionary
        labels[ofs.UNIQUEID] = label
        # UNFORTUNATELY some polygons are multipolygons (why does this object even exist?!)
        ofs_geom = ofs.geometry
        # if len(ofs_geom.geoms) > 1: raise
        # loop through both multipolygons and assign the same label
        for k in range(len(ofs_geom.geoms)):   
            # coordinates of polygon
            coords = np.array(ofs_geom.geoms[k].exterior.coords)
            # convert to image coordinates
            polygon = convert_world2pix(coords, georef)[:,[1,0]]
            # check that geometry fits inside the image, otherwise skip it
            x = polygon[:,1]
            y = polygon[:,0]
            if np.any(x<0) or np.any(y<0): continue
            if np.any(x>im0.shape[1]) or np.any(y>im0.shape[0]): continue
            # create mask (binary)
            mask_polygon = polygon2mask(im.shape, polygon)
            # multiply binary image by label
            mask_label = label*mask_polygon
            # set to 0 pixels that were already labelled
            mask_label[im0>0] = 0
            # add to mask
            im0 += mask_label
            
        #     np.random.seed(0)
        #     cmap = colors.ListedColormap(np.random.rand(len(gdf),3))
        #     plt.figure()
        #     plt.imshow(im0,cmap=cmap)
        #     for i in range(len(gdf)):
        #         ofs = gdf.iloc[i]
        #         ofs_geom = ofs.geometry
        #         for k in range(len(ofs_geom.geoms)):   
        #             # coordinates of polygon
        #             coords = np.array(ofs_geom.geoms[k].exterior.coords)
        #             # convert to image coordinates
        #             polygon = convert_world2pix(coords, georef)[:,[1,0]]
        #             # check that geometry fits inside the image, otherwise skip it
        #             x = polygon[:,1]
        #             y = polygon[:,0]
        #             plt.plot(polygon[:,1],polygon[:,0],'k-')
        
    # write labels dict to csv
    # write_dict_to_csv(labels, os.path.join('labels.csv'))
    
    # write with rasterio
    fn_im_labelled = os.path.join(fp_out_tiles,fn_tile)
    georef2 = from_origin(georef[0]-georef[1]/2, georef[3]-georef[5]/2, georef[1], georef[1])
    metadata = {
        'driver': 'GTiff',
        'count': 1, 
        'dtype': 'int16',  
        'width': im0.shape[1],
        'height': im0.shape[0],
        'crs': 'EPSG:%d'%epsg_image,  
        'transform': georef2,
        'compress': 'lzw',
    }
    with rasterio.open(fn_im_labelled, 'w', **metadata) as dst:
        dst.write(im0, 1) 
        
    # write .TIF file with GDAL
    # driver = gdal.GetDriverByName("GTiff")
    # dataset = driver.Create(fn_im_labelled, im0.shape[1], im0.shape[0], 1, gdal.GDT_UInt16)
    # georef[0] = georef[0] - georef[1]/2
    # georef[3] = georef[3] - georef[5]/2
    # dataset.SetGeoTransform(georef)
    # spatial_ref = osr.SpatialReference()
    # spatial_ref.ImportFromEPSG(epsg_image)
    # dataset.SetProjection(spatial_ref.ExportToWkt())
    # raster_band = dataset.GetRasterBand(1)
    # raster_band.WriteArray(im0.astype('uint16'))
    # metadata = {'AREA_OR_POINT': 'Area'}
    # dataset.SetMetadata(metadata)
    # dataset = None
    
#%% Generate masks for Sentinel-2

# load vector file
fp_layer = os.path.join(fp_inputs,'NRAR_FPH_OFS_Details_28355_buffer_20m.geojson')
gdf = gpd.read_file(fp_layer)
gdf['UNIQUEID'] = ['OFS_%05d'%_ for _ in np.arange(1,len(gdf)+1)]

# read Landsat tiles
fp_tiles = os.path.join(fp_inputs,'Sentinel2_tiles')
fn_tiles = os.listdir(fp_tiles)

# output folder
fp_out_tiles = os.path.join(fp_outputs,'Sentinel2_tiles_20m_shifted')
if not os.path.exists(fp_out_tiles): os.makedirs(fp_out_tiles)

def list_files_recursive(folder_path):
    all_files = []
    try:
        # Walk through the folder and its subfolders
        for root, dirs, files in os.walk(folder_path):
            # print(f"Files in '{root}':")
            for file in files:
                all_files.append(os.path.join(root, file))

    except FileNotFoundError:
        print(f"The specified folder '{folder_path}' does not exist.")
    except PermissionError:
        print(f"Permission error accessing the folder '{folder_path}'.")
        
    return all_files

for fn_tile in fn_tiles:
    tile_name = fn_tile[1:]
    fp_tile = os.path.join(fp_tiles,fn_tile)
    print('Processing %s ...'%tile_name)
    # find one band
    all_files = list_files_recursive(fp_tile)
    fp_image = [_ for _ in all_files if np.logical_and('_B02.jp2' in _,'IMG_DATA' in _)][0]
    # load band
    data = gdal.Open(fp_image, gdal.GA_ReadOnly)
    georef = np.array(data.GetGeoTransform())
    bands = [data.GetRasterBand(k + 1).ReadAsArray() for k in range(data.RasterCount)]
    im = bands[0]
    proj = osr.SpatialReference(wkt=data.GetProjection())
    epsg_image = int(proj.GetAttrValue('AUTHORITY',1))
    print('Image EPSG:%d'%epsg_image)
    
    # reproject vector layer to EPSG of tile
    gdf = reproject(gdf,epsg_image)
    
    # initialise mask with zeros
    im0 = np.zeros(im.shape)
    # initialise dictionary with labels
    labels = {}
    # loop through polygons
    for i in range(len(gdf)):
        print('\rAdding polygon %d/%d' % (i+1, len(gdf)), end='')
        label = (i+1)*LABEL_MULTIPLE
        ofs = gdf.iloc[i]
        # add label to dictionary
        labels[ofs.UNIQUEID] = label
        # UNFORTUNATELY some polygons are multipolygons (why does this object even exist?!)
        ofs_geom = ofs.geometry
        # if len(ofs_geom.geoms) > 1: raise
        # loop through both multipolygons and assign the same label
        for k in range(len(ofs_geom.geoms)):   
            # coordinates of polygon
            coords = np.array(ofs_geom.geoms[k].exterior.coords)
            # convert to image coordinates
            polygon = convert_world2pix(coords, georef)[:,[1,0]]
            # check that geometry fits inside the image, otherwise skip it
            x = polygon[:,1]
            y = polygon[:,0]
            if np.any(x<0) or np.any(y<0): continue
            if np.any(x>im0.shape[1]) or np.any(y>im0.shape[0]): continue
            # create mask (binary)
            mask_polygon = polygon2mask(im.shape, polygon)
            # multiply binary image by label
            mask_label = label*mask_polygon
            # set to 0 pixels that were already labelled
            mask_label[im0>0] = 0
            # add to mask
            im0 += mask_label
        
    # write labels dict to csv
    # write_dict_to_csv(labels, os.path.join('labels_S2.csv'))
    
    # write .TIF file with GDAL
    fn_image = fp_image.split('\\')[-1].replace('.jp2','.tif')
    fn_im_labelled = os.path.join(fp_out_tiles,fn_image)
    driver = gdal.GetDriverByName("GTiff")
    dataset = driver.Create(fn_im_labelled, im0.shape[1], im0.shape[0], 1, gdal.GDT_UInt16)
    georef[0] = georef[0] - georef[1]/2
    georef[3] = georef[3] - georef[5]/2
    dataset.SetGeoTransform(georef)
    spatial_ref = osr.SpatialReference()
    spatial_ref.ImportFromEPSG(epsg_image)
    dataset.SetProjection(spatial_ref.ExportToWkt())
    raster_band = dataset.GetRasterBand(1)
    raster_band.WriteArray(im0.astype('uint16'))
    dataset = None

# plot the image to check that it's correct
# np.random.seed(0)
# cmap = colors.ListedColormap(np.random.rand(len(gdf),3))

# plt.figure()
# plt.imshow(im0,cmap=cmap)

# plt.figure()
# plt.imshow(mask_polygon,cmap='Greys')
# plt.plot(polygon[:,1],polygon[:,0],'r-')
