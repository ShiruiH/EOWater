var landsat_collection = {
  'L5': ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA'),
  'L7': ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA'),
  'L8': ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA'),
  'L9': ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA')
};

var landsat_date_range = {
  'L5': ['2010-10-01', '2010-11-30'],
  'L7': ['2018-11-01', '2018-11-30'],
  'L8': ['2023-11-01', '2023-11-30'],
  'L9': ['2023-11-01', '2023-11-30']
};

// Specify the Landsat tiles you need (such as: '91_80', '92_81', '93_81')
var tile_list = ['90_80', '90_81', '90_82', '90_83', '91_80', '91_81', '91_82', '91_83', '92_80', '92_81', '92_82', '92_83', '93_81', '94_81']
// Specify the Landsat mission number you need (choose from: 'L5', 'L7', 'L8', 'L9')
var landsat_num = 'L8'

// Get an array of two dimensions to indicate (width,height) for Export.image.toDrive
var get_dimensions = function(img){
  var img_description = ee.Algorithms.Describe(img);
  var height = ee.List(ee.Dictionary(ee.List(ee.Dictionary(img_description).get('bands')).get(0)).get('dimensions')).get(1);
  var width = ee.List( ee.Dictionary(ee.List(ee.Dictionary(img_description).get('bands')).get(0)).get('dimensions')).get(0);

  return  ee.String(width).cat('x').cat(ee.String(height));
};

// For loop to download each tile
for (var x = 0; x < ee.List(tile_list).size().getInfo(); x ++){
  
  var tile = ee.List(tile_list).get(x);

  var path = ee.Number.parse(ee.String(tile).split('_').get(0));
  var row = ee.Number.parse(ee.String(tile).split('_').get(1));
  
  var criteria = ee.Filter.and(
  ee.Filter.date(landsat_date_range[landsat_num][0], landsat_date_range[landsat_num][1]),
  ee.Filter.eq('WRS_PATH', path),
  ee.Filter.eq('WRS_ROW', row)
  );
  
  var ic = landsat_collection[landsat_num].filter(criteria);

  var image = ee.Image(ic.first()).select('B2');
  
  var projection = image.projection().getInfo();
  
  var image_name = image.get('system:index').getInfo();
  
  var dimensions = get_dimensions(image).getInfo();
  
  Export.image.toDrive({
    description: image_name,
    folder: 'JOSS_Data',
    image: image,
    crs: projection.crs,
    fileFormat: 'GeoTIFF',
    crsTransform: projection.transform,
    maxPixels: 1e13,
    dimensions: dimensions
  });
}