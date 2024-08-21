var tileList = ['55HEE', '55HFE', '55JCG', '55JDG', '55JEF', '55JEG', '55JFF', '55JFG', '55JFH', '55JGF', '55JGG', '55JGH', '55JGJ', '56JKL', '56JKM', '56JKN', '56JKP']

// Get an array of two dimensions to indicate (width,height) for Export.image.toDrive
var get_dimensions = function(img){
  
  var img_description = ee.Algorithms.Describe(img);
  var height = ee.List(ee.Dictionary(ee.List(ee.Dictionary(img_description).get('bands')).get(0)).get('dimensions')).get(0);
  var width = ee.List( ee.Dictionary(ee.List(ee.Dictionary(img_description).get('bands')).get(0)).get('dimensions')).get(1);

  return  ee.String(width).cat('x').cat(ee.String(height));
};

// For loop to download each tile
for (var x = 0; x < ee.List(tileList).size().getInfo(); x ++){ // 17
  
  var tile = ee.List(tileList).get(x).getInfo();
  
  var criteria = ee.Filter.and(
  ee.Filter.date('2023-12-12', '2023-12-31'),
  ee.Filter.eq('MGRS_TILE', tile)
  );
  
  var ic = ee.ImageCollection('COPERNICUS/S2_HARMONIZED').filter(criteria);

  var image = ee.Image(ic.first()).select('B2');
  
  var projection = image.projection().getInfo();
  
  var imageName = image.get('system:index').getInfo();
  
  var dimensions = get_dimensions(image).getInfo();
  
  Export.image.toDrive({
    description: imageName,
    folder: 'JOSS_Data',
    image: image,
    crs: projection.crs,
    fileFormat: 'GeoTIFF',
    crsTransform: projection.transform,
    maxPixels: 1e13,
    dimensions: dimensions
  });
}
