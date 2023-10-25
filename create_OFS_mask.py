# Script to create polygon mask based on OFS layer for a Sentinel-2 tile

#%% Initial settings

import os
import numpy as np
import csv
import shutil
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

EPSG_TILE = 32755       # EPSG of the tile
PIXEL_SIZE = 10         # Pixel size of tile
LABEL_MULTIPLE = 5      # Multiple by which to multiply the labels
BUFFER_POLYGON = 20     # Buffer around polygons

#%% Generate mask

# load vector file
fp_layer = os.path.join('NorthernValleys_OFS_forNGIS_32755.geojson')
gdf = gpd.read_file(fp_layer)
# reproject to EPSG of tile
gdf = reproject(gdf,EPSG_TILE)

# load raster file'
fn_im = os.path.join('BaseOFS_Img_S2_55JGG.tif')
data = gdal.Open(fn_im, gdal.GA_ReadOnly)
georef = np.array(data.GetGeoTransform())
bands = [data.GetRasterBand(k + 1).ReadAsArray() for k in range(data.RasterCount)]
im = bands[0]

# create morphological element for dilation
buffer_in_pixels = np.ceil(BUFFER_POLYGON/PIXEL_SIZE)
se = morphology.disk(buffer_in_pixels)

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
        # binary dilation
        # mask_polygon = morphology.binary_dilation(mask_polygon, se)
        # multiply binary image by label
        mask_label = label*mask_polygon
        # set to 0 pixels that were already labelled
        mask_label[im0>0] = 0
        # add to mask
        im0 += mask_label

# write labels dict to csv
write_dict_to_csv(labels, os.path.join('labels.csv'))

# write .TIF file with GDAL
fn_im_labelled = os.path.join('BaseOFS_Img_S2_55JGG_labelled_nobuffer.tif')
driver = gdal.GetDriverByName("GTiff")
dataset = driver.Create(fn_im_labelled, im0.shape[1], im0.shape[0], 1, gdal.GDT_UInt16)
dataset.SetGeoTransform(georef)
spatial_ref = osr.SpatialReference()
spatial_ref.ImportFromEPSG(EPSG_TILE)
dataset.SetProjection(spatial_ref.ExportToWkt())
raster_band = dataset.GetRasterBand(1)
raster_band.WriteArray(im0.astype('uint16'))
dataset = None

# plot the image to check that it's correct
np.random.seed(0)
cmap = colors.ListedColormap(np.random.rand(len(gdf),3))

plt.figure()
plt.imshow(im0,cmap=cmap)

# plt.figure()
# plt.imshow(mask_polygon,cmap='Greys')
# plt.plot(polygon[:,1],polygon[:,0],'r-')
