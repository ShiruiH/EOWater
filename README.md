# Water surface area time-series from Sentinel-2 and Landat

This repository presents an efficient GEE-based solution to mapping water surface area time-series in waterbodies from Landsat and Sentinel-2.

<p align="center">
<img src="./doc/example_time-series.png" alt="drawing" width="700"/>
</p>

### 1. Create polygon masks

[01_Create_polygon_mask.ipynb](./01_Create_polygon_mask.ipynb): notebook to generate the polygon masks for Landsat and Sentinel-2 tiles using a waterbodies boundaries vector layer.

This creates a .tif file with a mask where each individual polygon is assigned a different value, which allows the process to distinguish them at a raster level.

<p align="center">
<img src="./doc/example_polygon_mask.PNG" alt="drawing" width="500"/>
</p>

### 2. Upload polygon masks to GEE Assets 

Once the polygon masks have been generated, they need to be uploaded as cloud assets to GEE.

1. Go to https://code.earthengine.google.com/, sign in and select your cloud project (in this example `nsw-dpe-gee-tst`).

2. Click on NEW > GeoTIFF Image Upload. Select your file in /outputs (e.g., `outputs/Sentinel2_tiles_mask/T55JGH_20231213T001111_B02.tif`).
<p align="center">
<img src="./doc/GEE_upload_1.png" alt="drawing" width="300"/>
</p>

3. Once uploaded, click on the asset and it should show up like in the screenshot below:
<p align="center">
<img src="./doc/GEE_upload_2.png" alt="drawing" width="400"/>
</p>

4. Click on Edit then on the PROPERTIES tab and Add property. Add a property called Tile with value 55JGH (or different tilename). This property is needed later on.
<p align="center">
<img src="./doc/GEE_upload_3.png" alt="drawing" width="400"/>
</p>

5. Repeat for the Landsat tiles, but add two properties, PATH and ROW with their respective values (example below for tile 090081).
<p align="center">
<img src="./doc/GEE_upload_4.png" alt="drawing" width="400"/>
</p>

6. Once all the individual tiles have been uploaded, click on NEW > Image Collection and create an image collection for Sentinel-2 (named it Base_Sentinel2_tiles) and for Landsat (name it Base_Landsat_tiles). 
<p align="center">
<img src="./doc/GEE_upload_5.png" alt="drawing" width="300"/>
</p>

7. Then drag and drop all the invididual tiles into their respective image collection (Sentinel-2 or Landsat). The image collection should look as below (17 tiles in that example):
<p align="center">
<img src="./doc/GEE_upload_6.png" alt="drawing" width="400"/>
</p>

8. Finally, upload the image labels which were saved in /outputs. Click on NEW > CSV file and select the file `outputs/labels_S2.csv` (or Landsat one, they are the same). Call the asset Base_labels.
<p align="center">
<img src="./doc/GEE_upload_7.png" alt="drawing" width="300"/>
</p>

You should get a table that relates each unique polygon id to an integer value, like shown below:
<p align="center">
<img src="./doc/GEE_upload_8.png" alt="drawing" width="300"/>
</p>

Now you are all setup to map water surface area time-series in GEE!

:warning: check that you have these 3 assets uploaded:
- `Base_Sentinel2_tiles`: image collection of polygon masks for each tile of interest for Sentinel-2.
- `Base_Landsat_tiles`: image collection of polygon masks for each tile of interest for Landsat.
- `Base_labels`: table relating each polygon id to its unique label value in the masks.

### 3. Run GEE scripts in Code Editor

The scripts are found in GEE_scripts and can be copied into the Code Editor and run there. They will output a set of CSV files with the time-series of water surface area for each polygon. The following scripts are available:
1. [WSA_monitoring_S2.js](./GEE_scripts/WSA_monitoring_S2.js): map water surface area on Sentinel-2 images.
2. [WSA_monitoring_L9.js](./GEE_scripts/WSA_monitoring_L9.js): map water surface area on Landsat 9 images.
3. [WSA_monitoring_L8.js](./GEE_scripts/WSA_monitoring_L8.js): map water surface area on Landsat 8 images.
4. [WSA_monitoring_L7.js](./GEE_scripts/WSA_monitoring_L7.js):
map water surface area on Landsat 7 images.
5. [WSA_monitoring_L5.js](./GEE_scripts/WSA_monitoring_L5.js):
map water surface area on Landsat 5 images.

Additionally, there is a Python script [WSA_scheduled_cloud_function.js](./GEE_scripts/WSA_scheduled_cloud_function.js) that can be setup as a Cloud Function to process Sentinel-2, Landsat 9 and Landsat 8 imagery as a cron job. 


### 4. Postprocess CSV files in Python

ADD A NOTEBOOK THAT READS CSV FILE THAT IS STORED IN CLOUD BUCKET AND MAKES ON PLOT PER POLYGON ID