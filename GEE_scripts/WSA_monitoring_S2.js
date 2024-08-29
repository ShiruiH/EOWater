// #####################################################
// Script to process S2 (2016-2024)
// #####################################################

ee.data.setDefaultWorkloadTag('ofs-historical-run')

// load assets with basemaps and labels
var baseOFS = ee.ImageCollection('projects/nsw-dpe-gee-tst/assets/OFS/Base_Sentinel2_tiles');
var labelsOFS = ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Base_labels');

//MNDWI threshold
var t_MNDWI = 0.1;
//Cloud threshold (0-100)
var t_cloud = 40;

// dates
var dates = ['2015-06-23','2025-01-01'];

// 
// All 5 valleys
var tileList = ['55HEE', '55HFE', '55JCG', '55JDG', '55JEF', '55JEG', '55JFF', '55JFG', '55JFH', '55JGF', '55JGG', '55JGH', '55JGJ', '56JKL', '56JKM', '56JKN', '56JKP']
// Namoi
// var tileList = ['55JFG', '55JGF', '55JGG', '56JKL', '56JKM']
// Test tiel
// var tileList = ['55JEG']

// #######################################################

print('Base rasters', baseOFS);
print('Labels', labelsOFS);
print('Dates', dates);
print('Tiles', tileList);

// The upgraded cloud masking method
function maskS2Cloud_new(image){
  var s2Joined = ee.Join.saveFirst('cloud_mask').apply
    ({primary: image,
    secondary: ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY'),
    condition: ee.Filter.equals({leftField: 'system:index', rightField: 'system:index'})})
  
  function cloudMask(s2img){
    var clouds = ee.Image(s2img.get('cloud_mask')).select('probability');
    var cMask = clouds.lt(40); // 40% is the threshold
    return ee.Image(s2img).updateMask(cMask)
  }
  return s2Joined.map(cloudMask)
}

function renameImagewithDate(img){
  var d = ee.Date(ee.Image(img).date().format("YYYY-MM-dd"))
  return img.set(
        "system:time_start", d.millis(), 
        "system:index", d.format("YYYY-MM-dd"),
        "system:id", d.format("YYYY-MM-dd"))
}

var addmNDWI_01 = function(image) {
  var mndwi = image.expression(
    '(green-SWIR)/(green+SWIR)', {
      'green': image.select('B3'),
      'SWIR': image.select('B11')
    }).rename('mNDWI');
  
  // Thresholding
  var thres = mndwi.gte(t_MNDWI).rename('thres');
  return image.addBands(mndwi).addBands(thres);
};

// Prepare the OFS Labels Dict
var labelsOFSKeys = labelsOFS.first().propertyNames().remove('system:index');
var labelsOFSValues = labelsOFSKeys.map(function(k){return labelsOFS.aggregate_array(k)});
var lablesList = ee.List(labelsOFSValues.get(1)).map(function(number){return ee.String(number);});
var labelsOFSDict = ee.Dictionary.fromLists(lablesList, labelsOFSValues.get(0));
print('labelsOFSDict', labelsOFSDict)
// Generate a dictionary to keep the cloud affected pixel values with OFS number
var cloudLabelsList = ee.List(labelsOFSValues.get(1)).map(function(number){return ee.String(ee.Number(number).subtract(1));});
var labelsCloudDict = ee.Dictionary.fromLists(cloudLabelsList, labelsOFSValues.get(0));
print('labelsCloudDict', labelsCloudDict);
// Generate a dictionary to keep the OFS and water surface overlapped pixels with OFS number
var waterLabelsList = ee.List(labelsOFSValues.get(1)).map(function(number){return ee.String(ee.Number(number).add(1));});
var labelsWaterDict = ee.Dictionary.fromLists(waterLabelsList, labelsOFSValues.get(0));
print('labelsWaterDict', labelsWaterDict);

// ------ Map over the entire 5 valleys ------ //
var allValleysOFS = baseOFS.map(function(eachTile){

  var feat = eachTile.geometry()
  var tileName = eachTile.get('Tile')
  
  var criteria = ee.Filter.and(
  ee.Filter.date(dates[0], dates[1]),
  ee.Filter.eq('MGRS_TILE', tileName)
  );

  var collection1 = ee.ImageCollection(
    maskS2Cloud_new(ee.ImageCollection('COPERNICUS/S2_HARMONIZED') // S2_TOA
                    .filter(criteria)
                    // Pre-filter to get less cloudy granules.
                    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',t_cloud))
                    .map(function(image){
                      var date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd');
                      date = ee.String(date);
                      return image.set('date', date);})
                    )).filter(ee.Filter.neq('system:index','2018-10-25')); // 2018-10-25 is empty and crashes the code
  
  // Sort the data
  var collection1 = collection1.sort('system:time_start');
  // Applying mNDWI to all images in the collection
  var binaryNDWI = collection1.map(addmNDWI_01).select(['thres'], ['thres']);
  
  // !!! @For loop through the S2 band ImageCollection
  var singleRegionFC = binaryNDWI.map(function(singleImage){
    // Get the bounds of available data area
    var singleImageBound = singleImage.geometry().coordinates()

    var singleImageDate = singleImage.date().format("YYYY-MM-dd", 'Australia/Sydney') // This is used with collection1
    var singleImageSysDate = ee.Date(singleImage.get('system:time_start')).format(null, 'UTC')
    
    // Keep the cloud masked layer (cloud: 0; non-cloud: 1)
    var cloudMask = singleImage.mask();

    var singleCloudMask = cloudMask.eq(0).selfMask().unmask(0);
    
    // Load the base OFS layer
    var baseOFS20mBuffer = eachTile.rename('b1');
    
    // Raster calc to find the cloudy pixels
    var baseOFS_cloud = baseOFS20mBuffer.subtract(singleCloudMask)
    
    // Keep the pixel number of after cloud masking
    // Why decimal (use .unweighted()):
    // https://gis.stackexchange.com/questions/452898/difference-in-pixel-quantity-calculation-using-google-earth-engine-gee-qgis-and
    var baseOFS_Cloud_Dict = ee.Dictionary(
        baseOFS_cloud.reduceRegion({
          reducer:ee.Reducer.frequencyHistogram().unweighted(),
          geometry:ee.Geometry.Polygon(singleImageBound),
          scale:10,
          maxPixels:1e13,
          crs: "EPSG:32755"
        }).get('b1')
      );

    // Find the cloudy OFS pixels, e.g. 34, 59
    var cloudDict = baseOFS_Cloud_Dict.select({selectors: labelsCloudDict.keys(), ignoreMissing: true});
    // Get the cloudy OFS labels, e.g. 35, 36, 60, 61
    var cloudyOFSKeys = cloudDict.keys().map(function(ele){
      return [ee.String(ee.Number.parse(ele).add(1)), ee.String(ee.Number.parse(ele).add(2))];
    }).flatten();
    // Remove the cloudy OFS from baseOFS_Cloud_Dict
    var baseOFS_NoCloud_Dict = baseOFS_Cloud_Dict.remove({selectors: cloudyOFSKeys.cat(cloudDict.keys()).cat(['null', '-1', '0']), ignoreMissing: true});
    
    // Raster calc to find the water pixels
    var baseOFS_biNDWI = baseOFS20mBuffer.add(singleImage.unmask(0)) // .clip(ee.Geometry.Polygon(singleImageBound))
    
    // Keep the pixel number of OFS overlapped with baseOFS
    var baseOFS_biNDWI_Dict = ee.Dictionary(
        baseOFS_biNDWI.reduceRegion({
          reducer:ee.Reducer.frequencyHistogram().unweighted(),
          geometry:ee.Geometry.Polygon(singleImageBound),
          scale:10,
          maxPixels:1e13,
          crs: "EPSG:32755"
        }).get('b1')
      );
      
    // Find the OFS pixels, e.g. 101, 106
    var waterDict = baseOFS_biNDWI_Dict.select({selectors: labelsWaterDict.keys(), ignoreMissing: true})

    // Remove cloudy OFS
    var water_NoCloud_Dict = waterDict.remove({selectors: cloudyOFSKeys, ignoreMissing: true})

    // Get the final OFS labels from my retrieval, e.g. 100, 105
    var finalOFSKeys = water_NoCloud_Dict.keys().map(function(ele){return ee.String(ee.Number.parse(ele).subtract(1))});
    
    // Regenerate water_NoCloud_Dict with the correct order (the key order should be the same with finalOFSLabels)
    water_NoCloud_Dict = ee.Dictionary.fromLists(finalOFSKeys, water_NoCloud_Dict.values());

    // Record the zero-area OFS
    var zeroAreaOFSDict = baseOFS_NoCloud_Dict.remove({selectors: finalOFSKeys, ignoreMissing: true})
    .map(function(key, val){
      return 0;
    })
    var zeroAreaOFSLabels = labelsOFSDict.select({selectors: zeroAreaOFSDict.keys(), ignoreMissing: true})
    // Record the final OFS labels
    var finalOFSLabels = labelsOFSDict.select({selectors: finalOFSKeys, ignoreMissing: true})

    // Record the final OFS labels and their pixel counts
    var finalOFSDict = ee.Dictionary.fromLists(finalOFSLabels.values().cat(zeroAreaOFSLabels.values()), water_NoCloud_Dict.values().cat(zeroAreaOFSDict.values()));
    
    var ks = finalOFSDict.keys()
    var finalOFS_FC = ee.FeatureCollection(ks.map(function(key){
      var ky = key
      var vl = finalOFSDict.get(key)
      var area = ee.Number(finalOFSDict.get(key)).multiply(100)
      return ee.Feature(null, {'system_time_utc': singleImageSysDate, 'UNIQUEID': ky, 'count': vl, 'area': area, 'tile': tileName})
      }));
      
    return finalOFS_FC
  }).flatten()
  return singleRegionFC
});

print('allValleysOFS', allValleysOFS.toList(allValleysOFS.size()))

for (var x = 0; x < allValleysOFS.size().getInfo(); x ++){ //

  var outputFC = allValleysOFS.toList(allValleysOFS.size()).get(x)
  var aoiName = 'S2_OFS_2015_2024_4Y_' + 'Tile_' + ee.List(tileList).get(x).getInfo()
  // var aoiName = ee.Feature(allValleysOFS.toList(allValleysOFS.size()).get(x)).get('aoi').getInfo()
  
  Export.table.toDrive({
    collection: outputFC,
    selectors: ['system_time_utc', 'UNIQUEID', 'count', 'area', 'tile'],
    folder: 'Combined_OFS_NWB_01threshold',
    description: aoiName,
    fileFormat: 'CSV'
  });
}
