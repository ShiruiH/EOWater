import base64
import time
import ee
import google.auth
from datetime import datetime, date, timedelta
import pytz


def handle_event(event, context):
    """Triggered from a message on a Cloud Pub/Sub topic.
    Args:
         event (dict): Event payload.
         context (google.cloud.functions.Context): Metadata for the event.
    """
    # Note that we don't actually care about the message here.
    credentials, project_id = google.auth.default()
    print(project_id)
    ee.Initialize(credentials, project=project_id)

    ee.data.setDefaultWorkloadTag('ofs_weekly_run')

    # dates in AEST for naming the folders
    tz = pytz.timezone('Australia/Sydney')
    today_AEST = datetime.now(tz = tz).date() # datetime(2024,5,13).date()
    startDate_AEST = today_AEST - timedelta(days=14)
    endDate_AEST = today_AEST
    print('startDate', startDate_AEST)
    print('endDate', endDate_AEST)
    week = today_AEST.isocalendar().week -1
    print('week', week)

    # UTC dates for GEE processing
    today_UTC = datetime.now(tz = pytz.utc).date() # today_AEST
    startDate = today_UTC - timedelta(days=14)
    endDate = today_UTC

    # cloud bucket location
    bucketLoc = f'test2/live/{startDate_AEST}_{endDate_AEST}_week_{week}/'

    # used for test runs
    # startDate_AEST = '2023-11-01'
    # endDate_AEST = '2024-01-01'
    # startDate = startDate_AEST
    # endDate = endDate_AEST
    # week = 'gap'
    # bucketLoc = f'test1/historical/'

    # Excute the functions here
    baseOFS_S2 = ee.ImageCollection('projects/nsw-dpe-gee-tst/assets/Combined_OFS_NWB/Base_Sentinel2_tiles')
    baseOFS_Landsat = ee.ImageCollection('projects/nsw-dpe-gee-tst/assets/Combined_OFS_NWB/Base_Landsat_tiles')

    # Process for S2 tiles
    for i in range(baseOFS_S2.size().getInfo()):

        # Get the i-th element from the collection
        image = ee.Image(baseOFS_S2.toList(baseOFS_S2.size()).get(i))
        tileName = image.get('Tile')
        print('tile name', tileName.getInfo())

        outputFC = process_tile_s2(image, str(startDate), str(endDate))

        # Create the AOI name
        aoiName = f'S2_OFS_Tile_{tileName.getInfo()}_{startDate}_{endDate}_week_{week}'

        # Export table to Cloud Bucket
        task = ee.batch.Export.table.toCloudStorage(
            collection=outputFC,
            description=aoiName,
            bucket='ofs-live-test',
            fileNamePrefix= bucketLoc + aoiName,
            fileFormat='CSV',
            selectors=['system_time_utc', 'UNIQUEID', 'count', 'area', 'tile']
        )

        # Start the export task
        task.start()
        print(f"Started task {task.id}.")

    # Process for Landsat tiles
    for i in range(baseOFS_Landsat.size().getInfo()):

        # Get the i-th element from the collection
        image = ee.Image(baseOFS_Landsat.toList(baseOFS_Landsat.size()).get(i))
        path = image.get('PATH')
        row = image.get('ROW')
        tileName = f'{path.getInfo()}_{row.getInfo()}'
        print('tile name', tileName)

        outputFC_L8 = process_tile_landsat(image, 'LANDSAT/LC08/C02/T1_TOA', str(startDate), str(endDate))

        # Create the AOI name
        aoiName_L8 = f'L8_OFS_Tile_{tileName}_{startDate}_{endDate}_week_{week}'

        # Export table to Cloud Bucket
        task = ee.batch.Export.table.toCloudStorage(
            collection=outputFC_L8,
            description=aoiName_L8,
            bucket='ofs-live-test',
            fileNamePrefix= bucketLoc + aoiName_L8,
            fileFormat='CSV',
            selectors=['system_time_utc', 'UNIQUEID', 'count', 'area', 'tile']
        )

        # Start the export task
        task.start()
        print(f"Started task {task.id}.")

        outputFC_L9 = process_tile_landsat(image, 'LANDSAT/LC09/C02/T1_TOA', str(startDate), str(endDate))

        aoiName_L9 = f'L9_OFS_Tile_{tileName}_{startDate}_{endDate}_week_{week}'

        # Export table to Cloud Bucket
        task = ee.batch.Export.table.toCloudStorage(
            collection=outputFC_L9,
            description=aoiName_L9,
            bucket='ofs-live-test',
            fileNamePrefix= bucketLoc + aoiName_L9,
            fileFormat='CSV',
            selectors=['system_time_utc', 'UNIQUEID', 'count', 'area', 'tile']
        )

        # Start the export task
        task.start()
        print(f"Started task {task.id}.")

# The upgraded cloud masking method
def mask_s2_cloud_new(s2ImageCollection):
    # Join the Sentinel-2 image with the cloud probability image
    s2_joined = ee.Join.saveFirst('cloud_mask').apply(
        primary=s2ImageCollection,
        secondary=ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY'),
        condition=ee.Filter.equals(leftField='system:index', rightField='system:index')
    )

    # Define a function to apply the cloud mask
    def cloud_mask(s2_img):
        clouds = ee.Image(s2_img.get('cloud_mask')).select('probability')
        c_mask = clouds.lt(40)  # 40% is the threshold
        return ee.Image(s2_img).updateMask(c_mask)

    # Map the cloud_mask function over the joined collection
    return s2_joined.map(cloud_mask)

# Landsat cloud masking
def mask_l89_toa(image):
    qa_mask = image.select('QA_PIXEL').bitwiseAnd(31).eq(0)
    saturation_mask = image.select('QA_RADSAT').eq(0)

    return image.updateMask(qa_mask) \
        .updateMask(saturation_mask) \
        .select(['B.*']) \
        .copyProperties(image, ["system:time_start"])

# Compute MNDWI for S2 and apply threshold
def add_mNDWI_s2(image):
    mndwi = image.expression(
        '(green-SWIR)/(green+SWIR)', {
            'green': image.select('B3'),
            'SWIR': image.select('B11')
        }
    ).rename('mNDWI')

    # Thresholding
    # If mNDWI less or equal to 0 => 0 else 1
    thres = mndwi.gte(0.1).rename('thres')

    return image.addBands([mndwi, thres])

# Compute MNDWI for Landsat and apply threshold
def add_mNDWI_landsat(image):
    mndwi = image.expression(
        '(green-SWIR)/(green+SWIR)', {
            'green': image.select('B3'),
            'SWIR': image.select('B6')
        }
    ).rename('mNDWI')

    # Thresholding
    # If mNDWI less or equal to 0 => 0 else 1
    thres = mndwi.gte(0.1).rename('thres')

    return image.addBands([mndwi, thres])

# Prepare labels
def prep_labels():
    labelsOFS = ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/Combined_OFS_NWB/Base_labels')

    # Get property names and remove 'system:index'
    labelsOFS_keys = labelsOFS.first().propertyNames().remove('system:index')

    # Map over the keys to aggregate arrays for each property
    labelsOFS_values = labelsOFS_keys.map(lambda k: labelsOFS.aggregate_array(k))

    # Create a list of labels (convert numbers to strings)
    labels_list = ee.List(labelsOFS_values.get(1)).map(lambda number: ee.String(ee.Number(number).format("%d")))

    # Create a dictionary from lists
    labelsOFSDict = ee.Dictionary.fromLists(labels_list, labelsOFS_values.get(0))
    # print('labelsOFSDict', labelsOFSDict.getInfo())

    # Generate a dictionary to keep the cloud-affected pixel values with OFS number
    cloud_labels_list = ee.List(labelsOFS_values.get(1)).map(
        lambda number: ee.String(ee.Number(number).subtract(1).format("%d")))
    labelsCloudDict = ee.Dictionary.fromLists(cloud_labels_list, labelsOFS_values.get(0))
    # print('labelsCloudDict', labelsCloudDict.getInfo())

    # Generate a dictionary to keep the OFS and water surface overlapped pixels with OFS number
    water_labels_list = ee.List(labelsOFS_values.get(1)).map(
        lambda number: ee.String(ee.Number(number).add(1).format("%d")))
    labelsWaterDict = ee.Dictionary.fromLists(water_labels_list, labelsOFS_values.get(0))
    # print('labelsWaterDict', labelsWaterDict.getInfo())

    return (
        labelsOFSDict,
        labelsCloudDict,
        labelsWaterDict
    )


def process_tile_s2(each_tile,start_date, end_date):
    feat = each_tile.geometry()
    tile_name = each_tile.get('Tile')

    # Define criteria for Sentinel-2 data
    criteria = ee.Filter.And(
        ee.Filter.date(start_date, end_date),
        ee.Filter.eq('MGRS_TILE', tile_name)
    )

    # Get Sentinel-2 images
    collection1 = ee.ImageCollection(
        mask_s2_cloud_new(ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
        .filter(criteria)
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40))
        .map(lambda image: image.set('date', ee.Date(image.get('system:time_start')).format('YYYY-MM-dd')))
    )).filter(ee.Filter.neq('system:index', '2018-10-25'))

    # Sort the data
    collection1 = collection1.sort('system:time_start')

    # Applying mNDWI to all images in the collection
    binary_NDWI = collection1.map(add_mNDWI_s2).select(['thres'], ['thres'])

    # Function to add metrics to an image
    def add_metrics(single_image):
        labelsOFSDict, labelsCloudDict, labelsWaterDict = prep_labels()

        # single_image_date = single_image.date().format("YYYY-MM-dd", 'Australia/Sydney')
        single_image_sys_date = ee.Date(single_image.get('system:time_start')).format(None, 'UTC')

        # Get the bounds of available data area
        single_image_bound = single_image.geometry().coordinates()

        # Keep the cloud masked layer (cloud: 0; non-cloud: 1)
        cloud_mask = single_image.mask()

        single_cloud_mask = cloud_mask.eq(0).selfMask().unmask(0)

        # Load the base OFS layer
        base_OFS_20m_buffer = each_tile.rename('b1')

        # Raster calc to find the cloudy pixels
        base_OFS_cloud = base_OFS_20m_buffer.subtract(single_cloud_mask)

        reducer = ee.Reducer.frequencyHistogram().unweighted()
        geom = ee.Geometry.Polygon(single_image_bound)

        # Keep the pixel number after cloud masking
        base_OFS_Cloud_Dict = ee.Dictionary(
            base_OFS_cloud.reduceRegion(
                reducer=reducer,
                geometry=geom,
                scale=10,
                maxPixels=1e13,
                crs="EPSG:32755"
            ).get('b1')
        )

        # Find the cloudy OFS pixels
        cloud_dict = base_OFS_Cloud_Dict.select(selectors=labelsCloudDict.keys(), ignoreMissing=True)

        # Get the cloudy OFS labels
        cloudy_OFS_keys = cloud_dict.keys().map(lambda ele: [ee.String(ee.Number.parse(ele).add(1).format("%d")),
                                                             ee.String(
                                                                 ee.Number.parse(ele).add(2).format("%d"))]).flatten()

        # Remove the cloudy OFS from baseOFS_Cloud_Dict
        base_OFS_NoCloud_Dict = base_OFS_Cloud_Dict.remove(
            selectors=cloudy_OFS_keys.cat(cloud_dict.keys()).cat(['null', '-1', '0']),
            ignoreMissing=True
        )

        # Raster calc to find the water pixels
        base_OFS_biNDWI = base_OFS_20m_buffer.add(single_image.unmask(0))

        # Keep the pixel number of OFS overlapped with baseOFS
        base_OFS_biNDWI_Dict = ee.Dictionary(
            base_OFS_biNDWI.reduceRegion(
                reducer=reducer,
                geometry=geom,
                scale=10,
                maxPixels=1e13,
                crs="EPSG:32755"
            ).get('b1')
        )

        # Find the OFS pixels
        water_dict = base_OFS_biNDWI_Dict.select(selectors=labelsWaterDict.keys(), ignoreMissing=True)

        # Remove cloudy OFS
        water_NoCloud_Dict = water_dict.remove(selectors=cloudy_OFS_keys, ignoreMissing=True)

        # Get the final OFS labels from my retrieval
        final_OFS_keys = water_NoCloud_Dict.keys().map(
            lambda ele: ee.String(ee.Number.parse(ele).subtract(1).format("%d")))

        # Regenerate water_NoCloud_Dict with the correct order
        water_NoCloud_Dict = ee.Dictionary.fromLists(final_OFS_keys, water_NoCloud_Dict.values())

        # Record the zero-area OFS
        zero_area_OFS_Dict = base_OFS_NoCloud_Dict.remove(selectors=final_OFS_keys, ignoreMissing=True).map(
            lambda key, val: 0)

        zero_area_OFS_labels = labelsOFSDict.select(
            selectors=zero_area_OFS_Dict.keys(), ignoreMissing=True)

        # Record the final OFS labels
        final_OFS_labels = labelsOFSDict.select(selectors=final_OFS_keys, ignoreMissing=True)

        # Record the final OFS labels and their pixel counts
        final_OFS_Dict = ee.Dictionary.fromLists(final_OFS_labels.values().cat(zero_area_OFS_labels.values()),
                                                 water_NoCloud_Dict.values().cat(zero_area_OFS_Dict.values()))

        ks = final_OFS_Dict.keys()

        # Create a FeatureCollection from the keys and values
        final_OFS_FC = ee.FeatureCollection(ks.map(lambda key: ee.Feature(
            None,
            {
                'system_time_utc': single_image_sys_date,
                'UNIQUEID': key,
                'count': final_OFS_Dict.get(key),
                'area': ee.Number(final_OFS_Dict.get(key)).multiply(100),
                'tile': each_tile.get('Tile')
            }
        )))

        return final_OFS_FC


    # Map over the S2 band ImageCollection
    single_region_FC = binary_NDWI.map(add_metrics)

    return single_region_FC.flatten()

# Process Landsat tiles
def process_tile_landsat(each_tile, satICName, start_date, end_date):
    feat = each_tile.geometry()
    path = each_tile.get('PATH')
    row = each_tile.get('ROW')

    # Define criteria for Landsat data
    criteria = ee.Filter.And(
        ee.Filter.date(start_date, end_date),
        ee.Filter.And(ee.Filter.eq('WRS_PATH', path),
                      ee.Filter.eq('WRS_ROW', row)),
        ee.Filter.lt('CLOUD_COVER',75),
        ee.Filter.lt('GEOMETRIC_RMSE_MODEL',10)
    )

    # Get Landsat images
    collection1 = ee.ImageCollection(ee.String(satICName)) \
        .filter(criteria) \
        .map(mask_l89_toa) \
        .map(lambda image: image.set('date', ee.Date(image.get('system:time_start'))
                                     .format('YYYY-MM-dd')))

    # Sort the data
    collection1 = collection1.sort('system:time_start')

    # Applying mNDWI to all images in the collection
    binary_NDWI = collection1.map(add_mNDWI_landsat).select(['thres'], ['thres'])

    # Function to add metrics to an image
    def add_metrics(single_image):
        labelsOFSDict, labelsCloudDict, labelsWaterDict = prep_labels()

        # single_image_date = single_image.date().format("YYYY-MM-dd", 'Australia/Sydney')
        single_image_sys_date = ee.Date(single_image.get('system:time_start')).format(None, 'UTC')

        # Get the bounds of available data area
        single_image_bound = single_image.geometry().coordinates()

        # Keep the cloud masked layer (cloud: 0; non-cloud: 1)
        cloud_mask = single_image.mask()

        single_cloud_mask = cloud_mask.eq(0).selfMask().unmask(0)

        # Load the base OFS layer
        base_OFS_20m_buffer = each_tile.rename('b1')

        # Raster calc to find the cloudy pixels
        base_OFS_cloud = base_OFS_20m_buffer.subtract(single_cloud_mask)

        reducer = ee.Reducer.frequencyHistogram().unweighted()
        geom = ee.Geometry.Polygon(single_image_bound)

        # Keep the pixel number after cloud masking
        base_OFS_Cloud_Dict = ee.Dictionary(
            base_OFS_cloud.reduceRegion(
                reducer=reducer,
                geometry=geom,
                scale=10,
                maxPixels=1e13,
                crs="EPSG:32655"
            ).get('b1')
        )

        # Find the cloudy OFS pixels
        cloud_dict = base_OFS_Cloud_Dict.select(selectors=labelsCloudDict.keys(), ignoreMissing=True)

        # Get the cloudy OFS labels
        cloudy_OFS_keys = cloud_dict.keys().map(lambda ele: [ee.String(ee.Number.parse(ele).add(1).format("%d")),
                                                             ee.String(
                                                                 ee.Number.parse(ele).add(2).format("%d"))]).flatten()

        # Remove the cloudy OFS from baseOFS_Cloud_Dict
        base_OFS_NoCloud_Dict = base_OFS_Cloud_Dict.remove(
            selectors=cloudy_OFS_keys.cat(cloud_dict.keys()).cat(['null', '-1', '0']),
            ignoreMissing=True
        )

        # Raster calc to find the water pixels
        base_OFS_biNDWI = base_OFS_20m_buffer.add(single_image.unmask(0))

        # Keep the pixel number of OFS overlapped with baseOFS
        base_OFS_biNDWI_Dict = ee.Dictionary(
            base_OFS_biNDWI.reduceRegion(
                reducer=reducer,
                geometry=geom,
                scale=10,
                maxPixels=1e13,
                crs="EPSG:32655"
            ).get('b1')
        )

        # Find the OFS pixels
        water_dict = base_OFS_biNDWI_Dict.select(selectors=labelsWaterDict.keys(), ignoreMissing=True)

        # Remove cloudy OFS
        water_NoCloud_Dict = water_dict.remove(selectors=cloudy_OFS_keys, ignoreMissing=True)

        # Get the final OFS labels from my retrieval
        final_OFS_keys = water_NoCloud_Dict.keys().map(
            lambda ele: ee.String(ee.Number.parse(ele).subtract(1).format("%d")))

        # Regenerate water_NoCloud_Dict with the correct order
        water_NoCloud_Dict = ee.Dictionary.fromLists(final_OFS_keys, water_NoCloud_Dict.values())

        # Record the zero-area OFS
        zero_area_OFS_Dict = base_OFS_NoCloud_Dict.remove(selectors=final_OFS_keys, ignoreMissing=True).map(
            lambda key, val: 0)

        zero_area_OFS_labels = labelsOFSDict.select(
            selectors=zero_area_OFS_Dict.keys(), ignoreMissing=True)

        # Record the final OFS labels
        final_OFS_labels = labelsOFSDict.select(selectors=final_OFS_keys, ignoreMissing=True)

        # Record the final OFS labels and their pixel counts
        final_OFS_Dict = ee.Dictionary.fromLists(final_OFS_labels.values().cat(zero_area_OFS_labels.values()),
                                                 water_NoCloud_Dict.values().cat(zero_area_OFS_Dict.values()))

        ks = final_OFS_Dict.keys()

        # Create a FeatureCollection from the keys and values
        final_OFS_FC = ee.FeatureCollection(ks.map(lambda key: ee.Feature(
            None,
            {
                'system_time_utc': single_image_sys_date,
                'UNIQUEID': key,
                'count': final_OFS_Dict.get(key),
                'area': ee.Number(final_OFS_Dict.get(key)).multiply(100),
                'tile': ee.String(ee.Number(path).int().format("%d")).cat('_').cat(ee.Number(row).int().format("%d"))
            }
        )))

        return final_OFS_FC

    # Map over the Landsat band ImageCollection
    single_region_FC = binary_NDWI.map(add_metrics)

    return single_region_FC.flatten()
