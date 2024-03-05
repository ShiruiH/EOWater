
// Use a small polygon to test the workflow if needed
// var geometry = ee.Geometry.Polygon(
//   [[149.27917885800002,-30.285029110999965],
//   [149.67850634100012,-30.285029110999965],
//   [149.67850634100012,-30.132062131999916],
//   [149.27917885800002,-30.132062131999916],
//   [149.27917885800002,-30.285029110999965]]
//   );

var baseOFS = ee.ImageCollection('projects/nsw-dpe-gee-tst/assets/OFS/BaseOFS_Landsat_tiles')
var labelsOFS = ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/BaseOFS_Landsat_Labels')

//function to mask Landsat-5/7_TOA cloud
function maskL457toa(image) {

  var qa_mask = image.select('QA_PIXEL').bitwiseAnd(31).eq(0);
  var saturation_mask = image.select('QA_RADSAT').eq(0);
  
  return image.updateMask(qa_mask)
              .updateMask(saturation_mask)
              .select('B*.')
              .copyProperties(image, ["system:time_start"]);

}

//function to mask Landsat-5/7_SR cloud
function maskL457sr(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBand = image.select('ST_B6').multiply(0.00341802).add(149.0);
  
  var qa_mask = image.select('QA_PIXEL').bitwiseAnd(31).eq(0);
  var saturation_mask = image.select('QA_RADSAT').eq(0);
  
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBand, null, true)
              .updateMask(qa_mask)
              .updateMask(saturation_mask)
              .select('SR_B*.')
              .copyProperties(image, ["system:time_start"]);

}

//mosaic same date images
function mosaicByDate(imcol){
  
  var imlist = imcol.toList(imcol.size())

  var unique_dates = imlist.map(function(im){
    return ee.Image(im).date().format("YYYY-MM-dd")
  }).distinct()

  var mosaic_imlist = unique_dates.map(function(d){
    d = ee.Date(d)

    var im = imcol
      .filterDate(d, d.advance(1, "day"))
      .mosaic()
    var speDate = imcol.filterDate(d, d.advance(1, "day")).first().get('system:time_start')
    // add geometries
    var geometries = imcol.filterDate(d, d.advance(1, "day")).map(function(img){
      return ee.Feature(img.geometry());
    });
    var mergedGeometries = geometries.union();

    return im.set(
        "system:time_start", d.millis(), 
        "system:index", d.format("YYYY-MM-dd"),
        "system:id", d.format("YYYY-MM-dd"),
        'specific_time', speDate,
        'system:footprint', mergedGeometries.geometry())
  })

  return ee.ImageCollection(mosaic_imlist)
}

// For L 7/5 SR
var addmNDWI_01_sr = function(image) {
  
  var mndwi = image.expression(
    '(green-SWIR)/(green+SWIR)', {
      'green': image.select('SR_B2'),
      'SWIR': image.select('SR_B5')
    }).rename('mNDWI');
    
  // var mndwi = image.normalizedDifference(['SR_B2', 'SR_B5']).rename('mNDWI'); // NO USE: this will automatically mask pixels where a negative pixel value in either input band
  
  //Thresholding
  //If mNDWI less or equal to 0 => 0 else 1
  var thres = mndwi.gte(0).rename('thres'); //0.095
  
  return image.addBands(mndwi).addBands(thres);
};

// For L 7/5 TOA
var addmNDWI_01_toa = function(image) {
  
  var mndwi = image.expression(
    '(green-SWIR)/(green+SWIR)', {
      'green': image.select('B2'),
      'SWIR': image.select('B5')
    }).rename('mNDWI');
  
  //Thresholding
  //If mNDWI less or equal to 0.1 => 0 else 1
  var thres = mndwi.gte(0.1).rename('thres'); //0.095
  
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

// ------ Started here ------ //
// ------ Started here ------ //
// ------ Started here ------ //

// ------ Map over the entire 5 valleys ------ //
var allValleysOFS = baseOFS.map(function(eachTile){

  var feat = eachTile.geometry();
  var path = eachTile.get('PATH');
  var row = eachTile.get('ROW');
  
  var criteria = ee.Filter.and(
    // ee.Filter.date('1986-01-01', '2013-07-01'), // L5: '1986-01-01', '2013-07-01'
    ee.Filter.date('1999-04-01', '2023-12-01'), // L7: '1999-04-01', '2023-12-01'
    ee.Filter.and(ee.Filter.eq('WRS_PATH', path),         
                  ee.Filter.eq('WRS_ROW', row))
                  );

  // var collection1 = ee.ImageCollection("LANDSAT/LT05/C02/T1_L2") // L5_SR
  // var collection1 = ee.ImageCollection("LANDSAT/LT05/C02/T1_TOA") // L5_TOA
  // var collection1 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2") // L7_SR
  var collection1 = ee.ImageCollection("LANDSAT/LE07/C02/T1_TOA") // L7_TOA
                  .filter(criteria)
                  .map(maskL457toa)
                  .map(function(image){
                    var date = ee.Date(image.get('system:time_start')).format("YYYY-MM-dd", 'Australia/Sydney');
                    date = ee.String(date);
                    return image.set('date', date);});

  // Sort the data
  // var collection_mosaic = collection_mosaic.sort('system:time_start');
  var collection1 = collection1.sort('system:time_start');

  var binaryNDWI = collection1.map(addmNDWI_01_toa).select(['thres'], ['thres']);

  // !!! @For loop through the L5 band ImageCollection
  var singleRegionFC = binaryNDWI.map(function(singleImage){
    // Get the bounds of available data area
    var singleImageBound = singleImage.geometry().coordinates()

    var singleImageDate = singleImage.date().format("YYYY-MM-dd", 'Australia/Sydney')
    var singleImageSysDate = ee.Date(singleImage.get('system:time_start')).format(null, 'UTC')
    
    // Keep the cloud masked layer (cloud: 0; non-cloud: 1)
    var cloudMask = singleImage.mask();

    // Revert the cloudMask (cloud: 1)
    var singleCloudMask = cloudMask.eq(0).selfMask().unmask(0);
    
    // Load the base OFS layer
    var baseOFS10mBuffer = eachTile.rename('b1');
    // Raster calc to find the cloudy pixels
    var baseOFS_cloud = baseOFS10mBuffer.clip(ee.Geometry.Polygon(singleImageBound)).subtract(singleCloudMask)
    
    // Keep the pixel number of after cloud masking
    // Why decimal (use .unweighted()):
    // https://gis.stackexchange.com/questions/452898/difference-in-pixel-quantity-calculation-using-google-earth-engine-gee-qgis-and
    var baseOFS_Cloud_Dict = ee.Dictionary(
        baseOFS_cloud.reduceRegion({
          reducer:ee.Reducer.frequencyHistogram().unweighted(),
          geometry:ee.Geometry.Polygon(singleImageBound),
          scale:10,
          maxPixels:1e13,
          crs: "EPSG:32655"
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
    var baseOFS_biNDWI = baseOFS10mBuffer.clip(ee.Geometry.Polygon(singleImageBound)).add(singleImage.unmask(0))
  
    // Keep the pixel number of OFS overlapped with baseOFS
    var baseOFS_biNDWI_Dict = ee.Dictionary(
        baseOFS_biNDWI.reduceRegion({
          reducer:ee.Reducer.frequencyHistogram().unweighted(),
          geometry:ee.Geometry.Polygon(singleImageBound),
          scale:10,
          maxPixels:1e13,
          crs: "EPSG:32655"
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
      var area = ee.Number(finalOFSDict.get(key)).multiply(100) // 100; 899 for 30m resolution
      return ee.Feature(null, {'date': singleImageDate, 'system_time_utc': singleImageSysDate, 'UNIQUEID': ky, 'count': vl, 'area': area, 'tile': ee.String(ee.Number(path).int()).cat('_').cat(ee.Number(row).int())})
      }));
      
    return finalOFS_FC
  }).flatten()
  return singleRegionFC
});

// Print one example to preview
print('allValleysOFS', allValleysOFS.toList(allValleysOFS.size()).get(5))

// var tileList = ['91_81', '92_81', '90_81', '90_82']
var tileList = ['90_80', '90_81', '90_82', '90_83', '91_80', '91_81', '91_82', '91_83', '92_80', '92_81', '92_82', '92_83', '93_81', '94_81']

for (var x = 0; x < 14; x ++){ //allValleysOFS.size().getInfo() will take too long and get stuck

  var outputFC = allValleysOFS.toList(allValleysOFS.size()).get(x)
  var aoiName = 'L7_OFS_1999_2003_25Y_' + 'Tile_' + ee.List(tileList).get(x).getInfo()
  // var aoiName = ee.Feature(allValleysOFS.toList(allValleysOFS.size()).get(x)).get('aoi').getInfo() // this will take too long and get stuck
  
  Export.table.toDrive({
    collection: outputFC,
    selectors: ['system_time_utc', 'UNIQUEID', 'count', 'area', 'tile'],
    folder: 'Historical_Extension',
    description: aoiName,
    fileFormat: 'CSV'
  });
}
