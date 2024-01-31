
var d = {
    geom: {
        pt : {
            australia : ee.Geometry.Point( [134.1166, -25.5569]),
            brisbane: ee.Geometry.Point([153.0422, -27.4399]),
            namoi: ee.Geometry.Point([149.27130, -30.15159]),
          },
    },
    map: {
        main : ui.Map()
    },
    fc : {
        ofs_labels: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/BaseOFS_Landsat_Labels'),
        ofs_list: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/baseOFS_2024'),
        s2_ofs_ts_55HEE: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55HEE'),
        s2_ofs_ts_55HFE: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55HFE'),
        s2_ofs_ts_55JCG: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JCG'),
        s2_ofs_ts_55JDG: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JDG'),
        s2_ofs_ts_55JEF: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JEF'),
        s2_ofs_ts_55JEG: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JEG'),
        s2_ofs_ts_55JFF: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JFF'),
        s2_ofs_ts_55JFG: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JFG'),
        s2_ofs_ts_55JFH: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JFG'),
        s2_ofs_ts_55JGF: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JFG'),
        s2_ofs_ts_55JGG: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JGG'),
        s2_ofs_ts_55JGH: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JGH'),
        s2_ofs_ts_55JGJ: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_55JGJ'),
        s2_ofs_ts_56JKL: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_56JKL'),
        s2_ofs_ts_56JKM: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_56JKM'),
        s2_ofs_ts_56JKN: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_56JKN'),
        s2_ofs_ts_56JKP: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/S2_OFS_2015_2023_8Y_Tile_56JKP'),
        l9_ofs_ts: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_90_81'),
        l8_ofs_ts_90_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_90_80'),
        l8_ofs_ts_90_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_90_81'),
        l8_ofs_ts_90_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_90_82'),
        l8_ofs_ts_91_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_91_80'),
        l8_ofs_ts_91_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_91_81'),
        l8_ofs_ts_91_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_91_82'),
        l8_ofs_ts_91_83: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_91_83'),
        l8_ofs_ts_92_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_92_80'),
        l8_ofs_ts_92_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_92_81'),
        l8_ofs_ts_92_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_92_82'),
        l8_ofs_ts_93_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_93_81'),
        l8_ofs_ts_94_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L8_OFS_2013_2023_11Y_Tile_94_81'),
        l7_ofs_ts_90_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_90_80'),
        l7_ofs_ts_90_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_90_81'),
        l7_ofs_ts_90_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_90_82'),
        l7_ofs_ts_91_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_91_80'),
        l7_ofs_ts_91_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_91_81'),
        l7_ofs_ts_91_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_91_82'),
        l7_ofs_ts_92_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_92_80'),
        l7_ofs_ts_92_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_92_81'),
        l7_ofs_ts_93_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_93_81'),
        l7_ofs_ts_94_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_94_81'),
        l7_ofs_ts_92_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L7_OFS_1999_2023_25Y_Tile_92_82'),
        l5_ofs_ts_90_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_90_80'),
        l5_ofs_ts_90_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_90_81'),
        l5_ofs_ts_90_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_90_82'),
        l5_ofs_ts_91_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_91_80'),
        l5_ofs_ts_91_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_91_81'),
        l5_ofs_ts_91_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_91_82'),
        l5_ofs_ts_92_80: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_92_80'),
        l5_ofs_ts_92_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_92_81'),
        l5_ofs_ts_92_82: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_92_82'),
        l5_ofs_ts_93_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_93_81'),
        l5_ofs_ts_94_81: ee.FeatureCollection('projects/nsw-dpe-gee-tst/assets/OFS/Outputs/L5_OFS_1986_2013_28Y_Tile_94_81'),
      },
    base_ofs_ic: {
        base_ofs_img_s2: ee.ImageCollection('projects/nsw-dpe-gee-tst/assets/OFS/BaseOFS_S2_tiles'),
        base_ofs_img_landsat: ee.ImageCollection('projects/nsw-dpe-gee-tst/assets/OFS/BaseOFS_Landsat_tiles'),
    },
    ic_sources: {
        'S2': ee.ImageCollection('COPERNICUS/S2'),
        'LC09' : ee.ImageCollection('LANDSAT/LC09/C02/T1_TOA'),
        'LC08': ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA'),
        'LE07': ee.ImageCollection('LANDSAT/LE07/C02/T1_TOA'),
        'LT05': ee.ImageCollection('LANDSAT/LT05/C02/T1_TOA'),
      },

    dct: {
        style: {
            main_header :{fontSize:"24px",fontWeight:'bold',textDecoration:'underline'},
            sub_header :{fontWeight:'bold'},
            date_label: {width: '80px', position:'middle-left', backgroundColor: '#EEFFEE'},
            text_message: {fontSize: '16px'},
            warning_message: {fontSize: '15px', backgroundColor: '#f5f7ab',  border: '1px dashed #f1f797', textDecoration: 'underline'},
            slider: { width:'80%', position:'middle-left', shown: true},},
    },
    // },
    str: {
        date_first : "",
        date_second : "",
        selected_ic: 'S2',
        total_images : "Set Location",
        total_area : "0.0",
        total_volume : "0.0",
        current_analysis : null,
        set_spectral : "SPECTRAL",
        set_structural : "STRUCTURAL",
        permit_property : "permit",
        gui_menu_current : "MAIN"
    },
    legend: {
        spectral_first : null,
    },
};

var f = {
    Init: function(){
        d.map.main.centerObject(d.geom.pt.namoi, 14);
        d.map.main.setOptions('ROADMAP');//"ROADMAP", "SATELLITE", "HYBRID" or "TERRAIN"
        d.map.main.style().set('cursor', 'crosshair');
        // d.ic.landsat8 = 
        f.Reset.Main();
        d.map.main.add( w.panel_gui.background );
        ui.root.clear();
        ui.root.add( d.map.main );
      },
    ui: {
        click_OFS_show_ts : function( this_click ){
            d.geom.pt.clickedPoint = ee.Geometry.Point( [this_click.lon, this_click.lat] ).buffer(1, 1);
            print('point', d.geom.pt.clickedPoint)
            var ofsSelected = ee.Feature(d.fc.ofs_list.filterBounds(d.geom.pt.clickedPoint ).first());
            if( ofsSelected.getInfo() !== null ){
                var ofsSelectedProps = ofsSelected.toDictionary()
                // TODO: before merging FCs, filter them with needed tiles. This requires the d.fc.ofs_list contains a column recording the overlapped Landsat and S2 tiles for each OFS_ID
                var ofs_ts_collection = ee.FeatureCollection([
                    d.fc.l5_ofs_ts_90_80,
                    d.fc.l5_ofs_ts_90_81,
                    d.fc.l5_ofs_ts_90_82,
                    d.fc.l5_ofs_ts_91_80,
                    d.fc.l5_ofs_ts_91_81,
                    d.fc.l5_ofs_ts_91_82,
                    d.fc.l5_ofs_ts_92_80,
                    d.fc.l5_ofs_ts_92_81,
                    d.fc.l5_ofs_ts_92_82,
                    d.fc.l5_ofs_ts_93_81,
                    d.fc.l5_ofs_ts_94_81,
                    d.fc.l7_ofs_ts_90_80,
                    d.fc.l7_ofs_ts_90_81,
                    d.fc.l7_ofs_ts_90_82,
                    d.fc.l7_ofs_ts_91_80,
                    d.fc.l7_ofs_ts_91_81,
                    d.fc.l7_ofs_ts_91_82,
                    d.fc.l7_ofs_ts_92_80,
                    d.fc.l7_ofs_ts_92_81,
                    d.fc.l7_ofs_ts_92_82,
                    d.fc.l7_ofs_ts_93_81,
                    d.fc.l7_ofs_ts_94_81,
                    d.fc.l8_ofs_ts_90_80,
                    d.fc.l8_ofs_ts_90_81,
                    d.fc.l8_ofs_ts_90_82,
                    d.fc.l8_ofs_ts_91_80,
                    d.fc.l8_ofs_ts_91_81,
                    d.fc.l8_ofs_ts_91_82,
                    d.fc.l8_ofs_ts_91_83,
                    d.fc.l8_ofs_ts_92_80,
                    d.fc.l8_ofs_ts_92_81,
                    d.fc.l8_ofs_ts_92_82,
                    d.fc.l8_ofs_ts_93_81,
                    d.fc.l8_ofs_ts_94_81,
                    d.fc.l9_ofs_ts,
                    d.fc.s2_ofs_ts_55HEE,
                    d.fc.s2_ofs_ts_55HFE,
                    d.fc.s2_ofs_ts_55JCG,
                    d.fc.s2_ofs_ts_55JDG,
                    d.fc.s2_ofs_ts_55JEF,
                    d.fc.s2_ofs_ts_55JEG,
                    d.fc.s2_ofs_ts_55JFF,
                    d.fc.s2_ofs_ts_55JFF,
                    d.fc.s2_ofs_ts_55JFG,
                    d.fc.s2_ofs_ts_55JFH,
                    d.fc.s2_ofs_ts_55JGF,
                    d.fc.s2_ofs_ts_55JGG,
                    d.fc.s2_ofs_ts_55JGH,
                    d.fc.s2_ofs_ts_56JKL,
                    d.fc.s2_ofs_ts_56JKM,
                    d.fc.s2_ofs_ts_56JKN,
                    d.fc.s2_ofs_ts_56JKP,
                ]).flatten()
                var ts = ofs_ts_collection.filter(ee.Filter.equals('UNIQUEID', ofsSelectedProps.get('UNIQUEID'))).distinct(['system_time_utc'])
                print('ts', ts)
                // Keep a property of 'system:time_start' so the FC can be sorted and filtered
                ts = ts.map(function(feat){
                    var date = ee.Date(feat.get('system_time_utc'))
                    return ee.Feature(feat).set('system:time_start', date).copyProperties(feat)
                }).sort('system:time_start');
                // filterDate with selected start and end date
                var start_date = ee.Date(w.slider.period_slider_1.getValue()[0]);
                print('start_date', start_date)
                var end_date = ee.Date(w.slider.period_slider_2.getValue()[0]);
                print('end_date', end_date)
                // ts = ts.filterDate('1995-01-01', '2010-01-01');
                ts = ts.filterDate(start_date, end_date);
                if (ts.size().getInfo() !== 0){
                    print('new ts', ts)
                    var plottedArea = ee.Array(ts.aggregate_array('area')).multiply(0.0001)
                    // Keep only the date for hAxis labels display
                    var timeDict = ts.aggregate_array('system:time_start');
                    var dateDict = timeDict.map(function(ele){
                    return ee.Date(ele).format('YYYY-MM-dd');
                    });
                    print('dateDict', dateDict)
                    var tsChart = ui.Chart.array.values({array: plottedArea, axis: 0, xLabels: dateDict})
                    .setOptions({
                        title: ee.String(ofsSelected.get('UNIQUEID')).cat(ee.String(' time series')).getInfo(),
                        hAxis: {
                        title: 'Date (UTC)',
                        //   format: 'YYYY', // not working
                        titleTextStyle: {italic: false, bold: true},
                        //   ticks: '',
                        },
                        vAxis: {
                        title: 'Area (Ha)',
                        titleTextStyle: {italic: false, bold: true}
                        },
                        colors: ['0f8755'],
                        lineSize: 3,
                        pointSize: 3
                    });
                    w.panel_nongui.ofs_ts_chart.clear();
                    f.ui.RemoveOFStsChart() // click on a new OFS, the chart is automatically updated; the chart can also be closed by the next line 
                    w.panel_nongui.ofs_ts_chart.add(w.button.remove_ofs_ts_chart)
                    w.panel_nongui.ofs_ts_chart.add(tsChart)
                    // w.panel_gui.menu_main.add( w.panel_nongui.ofs_ts_chart ); // this can print to the the panel
                    var downloadFileName = 'Time_series_' + ofsSelected.get('UNIQUEID').getInfo()
                    var params = {
                        format: 'CSV',
                        filename: downloadFileName,
                        selectors: ['system_time_utc', 'UNIQUEID', 'count', 'area', 'tile'],
                        };
                    var url = ts.getDownloadURL(params);

                    w.panel_nongui.ofs_ts_chart.add(ui.Label( {value:'Download ' + downloadFileName, targetUrl:url} ) );
                    d.map.main.add( w.panel_nongui.ofs_ts_chart );
                } else {
                    w.panel_nongui.no_data_message_panel.add(w.label.no_data_message)
                    w.panel_nongui.no_data_message_panel.add(w.button.close_message);
                    d.map.main.add( w.panel_nongui.no_data_message_panel);
                };
            } else {
                w.panel_nongui.no_data_message_panel.add(w.label.no_data_message)
                w.panel_nongui.no_data_message_panel.add(w.button.close_message);
                d.map.main.add( w.panel_nongui.no_data_message_panel);
            };
            
          },
        tailor_OFS_params: function () {
            var dataSource = d.ic_sources[w.select.ic_sources.getValue()];
            // var satName = ee.String(dataSource.get('system:id')).split('/').get(1)
            // filter with roi bounds, selected start and end date
            var bounds =  d.map.main.getBounds(true);
            var start_date = ee.Date(w.slider.period_slider_1.getValue()[0]);
            print('start_date', start_date)
            var end_date = ee.Date(w.slider.period_slider_2.getValue()[0]);
            print('end_date', end_date)
            // ts = ts.filterDate('1995-01-01', '2010-01-01');
            if (w.select.ic_sources.getValue() === 'S2'){
                var collection1 = ee.ImageCollection(
                    f.ui.maskS2Cloud(ee.ImageCollection(dataSource)
                                    .filterDate(start_date, end_date)
                                    .filterBounds(bounds)
                                    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',40))
                                    .map(function(image){
                                      var date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd');
                                      date = ee.String(date);
                                      return image.clip(bounds).set('date', date);
                                    }))).filter(ee.Filter.neq('system:index','2018-10-25'));
                if( collection1.size().getInfo() === 0 ){
                    w.panel_nongui.no_data_message_panel.add(w.label.no_data_message1)
                    w.panel_nongui.no_data_message_panel.add(w.button.close_message);
                    d.map.main.add( w.panel_nongui.no_data_message_panel);
                    } else {
                        // Mosaic satData
                        var satData=f.ui.mosaicByDate(collection1)
                        // Sort the data
                        var satData = satData.sort('system:time_start');
                        print('satData', satData)
                        
                        var binaryNDWI = satData.map(f.ui.calc_mNDWI_S2).select(['thres'], ['thres']);
                        print('binaryNDWI', binaryNDWI)

                        var baseOFS = d.base_ofs_ic.base_ofs_img_s2.filterBounds(bounds).toBands().rename('b1')
                        print('baseOFS', baseOFS)

                        var ofs_area = f.ui.calc_ofs_area_ic(binaryNDWI, baseOFS, bounds, 'EPSG:32755')
                        print('ofs_area', ofs_area)
                        f.ui.downloadData(w.select.ic_sources.getValue(), ofs_area)
                    };

            }
            if (w.select.ic_sources.getValue() === 'LC09'){
                var collection1 = ee.ImageCollection(dataSource)
                                    .filterDate(start_date, end_date)
                                    .filterBounds(bounds)
                                    .map(f.ui.maskl8toa)
                                    .map(function(image){
                                        var date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd');
                                        date = ee.String(date);
                                        return image.clip(bounds).set('date', date);});
                if( collection1.size().getInfo() === 0 ){
                    w.panel_nongui.no_data_message_panel.add(w.label.no_data_message1)
                    w.panel_nongui.no_data_message_panel.add(w.button.close_message);
                    d.map.main.add( w.panel_nongui.no_data_message_panel);
                    } else {
                        // Mosaic satData
                        var satData=f.ui.mosaicByDate(collection1)
                        // Sort the data
                        var satData = satData.sort('system:time_start');
                        print('satData', satData)
                        
                        var binaryNDWI = satData.map(f.ui.calc_mNDWI_L89).select(['thres'], ['thres']);
                        print('binaryNDWI', binaryNDWI)

                        var baseOFS = d.base_ofs_ic.base_ofs_img_landsat.filterBounds(bounds).toBands().rename('b1')
                        print('baseOFS', baseOFS)

                        var ofs_area = f.ui.calc_ofs_area_ic(binaryNDWI, baseOFS, bounds, 'EPSG:32655')
                        print('ofs_area', ofs_area)
                        f.ui.downloadData(w.select.ic_sources.getValue(), ofs_area)
                    };
            }
            if (w.select.ic_sources.getValue() === 'LC08'){
                var collection1 = ee.ImageCollection(dataSource)
                                    .filterDate(start_date, end_date)
                                    .filterBounds(bounds)
                                    .map(f.ui.maskl8toa)
                                    .map(function(image){
                                        var date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd');
                                        date = ee.String(date);
                                        return image.clip(bounds).set('date', date);});

                if( collection1.size().getInfo() === 0 ){
                    w.panel_nongui.no_data_message_panel.add(w.label.no_data_message1)
                    w.panel_nongui.no_data_message_panel.add(w.button.close_message);
                    d.map.main.add( w.panel_nongui.no_data_message_panel);
                    } else {
                        // Mosaic satData
                        var satData=f.ui.mosaicByDate(collection1)
                        // Sort the data
                        var satData = satData.sort('system:time_start');
                        print('satData', satData)
                        
                        var binaryNDWI = satData.map(f.ui.calc_mNDWI_L89).select(['thres'], ['thres']);
                        print('binaryNDWI', binaryNDWI)

                        var baseOFS = d.base_ofs_ic.base_ofs_img_landsat.filterBounds(bounds).toBands().rename('b1')
                        print('baseOFS', baseOFS)
                        
                        var ofs_area = f.ui.calc_ofs_area_ic(binaryNDWI, baseOFS, bounds, 'EPSG:32655')
                        print('ofs_area', ofs_area)
                        f.ui.downloadData(w.select.ic_sources.getValue(), ofs_area)
                    };               
              
            }
            if (w.select.ic_sources.getValue() === 'LE07'){
                var collection1 = ee.ImageCollection(dataSource)
                                    .filterDate(start_date, end_date)
                                    .filterBounds(bounds)
                                    .map(f.ui.maskL457toa)
                                    .map(function(image){
                                        var date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd');
                                        date = ee.String(date);
                                        return image.clip(bounds).set('date', date);});
                
                if( collection1.size().getInfo() === 0 ){
                    w.panel_nongui.no_data_message_panel.add(w.label.no_data_message1)
                    w.panel_nongui.no_data_message_panel.add(w.button.close_message);
                    d.map.main.add( w.panel_nongui.no_data_message_panel);
                    } else {
                        // Mosaic satData
                        var satData=f.ui.mosaicByDate(collection1)
                        // Sort the data
                        var satData = satData.sort('system:time_start');
                        print('satData', satData)
                        
                        var binaryNDWI = satData.map(f.ui.calc_mNDWI_L57).select(['thres'], ['thres']);
                        print('binaryNDWI', binaryNDWI)

                        var baseOFS = d.base_ofs_ic.base_ofs_img_landsat.filterBounds(bounds).toBands().rename('b1')
                        print('baseOFS', baseOFS)
                        
                        var ofs_area = f.ui.calc_ofs_area_ic(binaryNDWI, baseOFS, bounds, 'EPSG:32655')
                        print('ofs_area', ofs_area)
                        f.ui.downloadData(w.select.ic_sources.getValue(), ofs_area)
                    };
            }
            if (w.select.ic_sources.getValue() === 'LT05'){
                var collection1 = ee.ImageCollection(dataSource)
                                    .filterDate(start_date, end_date)
                                    .filterBounds(bounds)
                                    .map(f.ui.maskL457toa)
                                    .map(function(image){
                                        var date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd');
                                        date = ee.String(date);
                                        return image.clip(bounds).set('date', date);});
                if( collection1.size().getInfo() === 0 ){
                    w.panel_nongui.no_data_message_panel.add(w.label.no_data_message1)
                    w.panel_nongui.no_data_message_panel.add(w.button.close_message);
                    d.map.main.add( w.panel_nongui.no_data_message_panel);
                    } else {
                        // Mosaic satData
                        var satData=f.ui.mosaicByDate(collection1)
                        // Sort the data
                        var satData = satData.sort('system:time_start');
                        print('satData', satData)
                        
                        var binaryNDWI = satData.map(f.ui.calc_mNDWI_L57).select(['thres'], ['thres']);
                        print('binaryNDWI', binaryNDWI)

                        var baseOFS = d.base_ofs_ic.base_ofs_img_landsat.filterBounds(bounds).toBands().rename('b1')
                        print('baseOFS', baseOFS)
                        
                        var ofs_area = f.ui.calc_ofs_area_ic(binaryNDWI, baseOFS, bounds, 'EPSG:32655')
                        print('ofs_area', ofs_area)
                        f.ui.downloadData(w.select.ic_sources.getValue(), ofs_area)
                    };
                
            }
        },
        ofs_label_dicts: function(){
            // Prepare the OFS Labels Dict
            var labelsOFSKeys = d.fc.ofs_labels.first().propertyNames().remove('system:index');
            var labelsOFSValues = labelsOFSKeys.map(function(k){return d.fc.ofs_labels.aggregate_array(k)});
            var lablesList = ee.List(labelsOFSValues.get(1)).map(function(number){return ee.String(number);});
            var labelsOFSDict = ee.Dictionary.fromLists(lablesList, labelsOFSValues.get(0));
            // print('labelsOFSDict', labelsOFSDict)
            // Generate a dictionary to keep the cloud affected pixel values with OFS number
            var cloudLabelsList = ee.List(labelsOFSValues.get(1)).map(function(number){return ee.String(ee.Number(number).subtract(1));});
            var labelsCloudDict = ee.Dictionary.fromLists(cloudLabelsList, labelsOFSValues.get(0));
            // print('labelsCloudDict', labelsCloudDict);
            // Generate a dictionary to keep the OFS and water surface overlapped pixels with OFS number
            var waterLabelsList = ee.List(labelsOFSValues.get(1)).map(function(number){return ee.String(ee.Number(number).add(1));});
            var labelsWaterDict = ee.Dictionary.fromLists(waterLabelsList, labelsOFSValues.get(0));
            // print('labelsWaterDict', labelsWaterDict);
            return {
                labelsOFSDict:labelsOFSDict,
                labelsCloudDict: labelsCloudDict,
                labelsWaterDict: labelsWaterDict}
        },
        calc_ofs_area_ic: function (binaryNDWI_ic, baseOFSLayer, bounds, crsCode){
            // Get the OFS label Dicts
            var labels = f.ui.ofs_label_dicts()
            print('labels', labels)

            var singleRegionFC = binaryNDWI_ic.map(function(singleImage){
                // Get the bounds of available data area
                var singleImageBound = singleImage.geometry().coordinates()

                var singleImageSysDate = ee.Date(singleImage.get('system:time_start')).format("YYYY-MM-dd", 'Australia/Sydney') //.format(null , 'UTC')         
                
                var baseOFS_cloud = singleImageBound.map(function(singlePoly){
                  // Keep the cloud masked layer (cloud: 0; non-cloud: 1)
                  var cloudMask = singleImage.clip(ee.Geometry.Polygon(singlePoly)).mask();
                  // Revert the cloudMask (cloud: 1)
                  var singleCloudMask = cloudMask.eq(0).selfMask().unmask(0).clip(ee.Geometry.Polygon(singlePoly));
                  
                  // Raster calc to find the cloudy pixels
                  var baseOFS_cloud_1 = baseOFSLayer.clip(ee.Geometry.Polygon(singlePoly)).subtract(singleCloudMask)
              
                  return baseOFS_cloud_1
                }).flatten();
              
                var baseOFS_Cloud_Dict = ee.Dictionary(
                    ee.ImageCollection(baseOFS_cloud).mosaic().reduceRegion({
                      reducer:ee.Reducer.frequencyHistogram().unweighted(),
                      geometry:bounds,
                      scale:10,
                      maxPixels:1e13,
                      crs: crsCode
                    }).get('b1')
                  );
            
                // Find the cloudy OFS pixels, e.g. 34, 59
                var cloudDict = baseOFS_Cloud_Dict.select({selectors: labels.labelsCloudDict.keys(), ignoreMissing: true});
                // Get the cloudy OFS labels, e.g. 35, 36, 60, 61
                var cloudyOFSKeys = cloudDict.keys().map(function(ele){
                  return [ee.String(ee.Number.parse(ele).add(1)), ee.String(ee.Number.parse(ele).add(2))];
                }).flatten();
                // Remove the cloudy OFS from baseOFS_Cloud_Dict
                var baseOFS_NoCloud_Dict = baseOFS_Cloud_Dict.remove({selectors: cloudyOFSKeys.cat(cloudDict.keys()).cat(['null', '-1', '0']), ignoreMissing: true});

                var baseOFS_biNDWI = singleImageBound.map(function(singlePoly){
                  // Raster calc to find the water pixels
                  var baseOFS_biNDWI_1 = baseOFSLayer.clip(ee.Geometry.Polygon(singlePoly)).add(singleImage.unmask(0))
              
                  return baseOFS_biNDWI_1
                }).flatten()
              
                var baseOFS_biNDWI_Dict = ee.Dictionary(
                    ee.ImageCollection(baseOFS_biNDWI).mosaic().reduceRegion({
                      reducer:ee.Reducer.frequencyHistogram().unweighted(),
                      geometry:bounds,
                      scale:10,
                      maxPixels:1e13,
                      crs: crsCode
                    }).get('b1')
                  );
                  
                // Find the OFS pixels, e.g. 101, 106
                var waterDict = baseOFS_biNDWI_Dict.select({selectors: labels.labelsWaterDict.keys(), ignoreMissing: true})
            
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
                var zeroAreaOFSLabels = labels.labelsOFSDict.select({selectors: zeroAreaOFSDict.keys(), ignoreMissing: true})
                // Record the final OFS labels
                var finalOFSLabels = labels.labelsOFSDict.select({selectors: finalOFSKeys, ignoreMissing: true})
            
                // Record the final OFS labels and their pixel counts
                var finalOFSDict = ee.Dictionary.fromLists(finalOFSLabels.values().cat(zeroAreaOFSLabels.values()), water_NoCloud_Dict.values().cat(zeroAreaOFSDict.values()));
                
                var ks = finalOFSDict.keys()
                var finalOFS_FC = ee.FeatureCollection(ks.map(function(key){
                  var ky = key
                  var vl = finalOFSDict.get(key)
                  var area = ee.Number(finalOFSDict.get(key)).multiply(100)
                  return ee.Feature(null, {'system_time_utc': singleImageSysDate, 'UNIQUEID': ky, 'count': vl, 'area': area})
                  }));
                
                return finalOFS_FC
              }).flatten()
              return singleRegionFC
        },
        maskS2Cloud: function(image){
            var s2Joined = ee.Join.saveFirst('cloud_mask').apply
              ({primary: image,
              secondary: ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY'),
              condition: ee.Filter.equals({leftField: 'system:index', rightField: 'system:index'})})
            
            function cloudMask(s2img){
              var clouds = ee.Image(s2img.get('cloud_mask')).select('probability');
              var cMask = clouds.lt(40);
              return ee.Image(s2img).updateMask(cMask)
            }
            return s2Joined.map(cloudMask)
        },
        maskl8toa: function(image){
            var qa_mask = image.select('QA_PIXEL').bitwiseAnd(31).eq(0);
            var saturation_mask = image.select('QA_RADSAT').eq(0);
  
            return image.updateMask(qa_mask)
                        .updateMask(saturation_mask)
                        .select('B*.')
                        .copyProperties(image, ["system:time_start"]);
        },
        maskL457toa: function(image){
            var qa_mask = image.select('QA_PIXEL').bitwiseAnd(31).eq(0);
            var saturation_mask = image.select('QA_RADSAT').eq(0);
            
            return image.updateMask(qa_mask)
                        .updateMask(saturation_mask)
                        .select('B*.')
                        .copyProperties(image, ["system:time_start"]);
          },
        mosaicByDate: function(imcol){
  
            var imlist = imcol.toList(imcol.size())
          
            var unique_dates = imlist.map(function(im){
              return ee.Image(im).date().format("YYYY-MM-dd")
            }).distinct()
          
            var mosaic_imlist = unique_dates.map(function(d){
              d = ee.Date(d)
          
              var im = imcol
                .filterDate(d, d.advance(1, "day"))
                .mosaic()
              
              // add geometries
              var geometries = imcol.filterDate(d, d.advance(1, "day")).map(function(img){
                return ee.Feature(img.geometry());
              });
              var mergedGeometries = geometries.union();
          
              return im.set(
                  "system:time_start", d.millis(), 
                  "system:index", d.format("YYYY-MM-dd"),
                  "system:id", d.format("YYYY-MM-dd"),
                  'system:footprint', mergedGeometries.geometry())
            })
          
            return ee.ImageCollection(mosaic_imlist)
          },
        calc_mNDWI_S2: function(image) {
            var mndwi = image.expression(
              '(green-SWIR)/(green+SWIR)', {
                'green': image.select('B3'),
                'SWIR': image.select('B11')
              }).rename('mNDWI');
            
            //Thresholding
            var bimNDWIThres = w.slider.mNDWI_threshold.getValue();
            print('bimNDWIThres', bimNDWIThres)

            var thres = mndwi.gte(bimNDWIThres).rename('thres');
            
            return image.addBands(mndwi).addBands(thres);
        },
        calc_mNDWI_L89: function(image){
            var mndwi = image.expression(
                '(green-SWIR)/(green+SWIR)', {
                  'green': image.select('B3'),
                  'SWIR': image.select('B6')
                }).rename('mNDWI');
              
            //Thresholding
            var bimNDWIThres = w.slider.mNDWI_threshold.getValue();
            print('bimNDWIThres', bimNDWIThres)

            var thres = mndwi.gte(bimNDWIThres).rename('thres');
            
            return image.addBands(mndwi).addBands(thres);
        },
        calc_mNDWI_L57: function(image){
            var mndwi = image.expression(
                '(green-SWIR)/(green+SWIR)', {
                  'green': image.select('B2'),
                  'SWIR': image.select('B5')
                }).rename('mNDWI');
              
            //Thresholding
            var bimNDWIThres = w.slider.mNDWI_threshold.getValue();
            print('bimNDWIThres', bimNDWIThres)

            var thres = mndwi.gte(bimNDWIThres).rename('thres');
            
            return image.addBands(mndwi).addBands(thres);
        },
        calArea: function(feature) {
            // Get the original property value
            var pixelCount = ee.Number(feature.get('count'));
          
            var areaRaster = pixelCount.multiply(ee.Number(100)); // WGS84: 86; UTM55: 100
            var areaVector = feature.geometry().area({'maxError': 1, 'proj': 'EPSG:32755'});
            
            // Add the new property to the feature
            return feature.set('areaRaster', areaRaster, 'areaVector', areaVector);
        },
        downloadData: function(satName, downloadOFS) {
            var downloadFileName = satName + '_OFS'
            var params = {
                format: 'CSV',
                filename: downloadFileName,
                selectors: ['system_time_utc', 'UNIQUEID', 'count', 'area'],
                };
            var url = downloadOFS.getDownloadURL(params);

            w.panel_gui.download_data_panel.add(ui.Label( {value:'Download ' + downloadFileName, targetUrl:url} ) );
            w.panel_gui.download_data_panel.add(w.button.close_download_window);
            d.map.main.add( w.panel_gui.download_data_panel);
        },
        bufferFeature_Erosion: function(feat){
            return feat.buffer(-20)
        },
        RemoveOFStsChart : function(){
            d.map.main.remove( w.panel_nongui.ofs_ts_chart );
            w.panel_nongui.ofs_ts_chart.clear();
        },
        RemoveMessage : function(){
            d.map.main.remove( w.panel_nongui.no_data_message_panel );
            w.panel_nongui.no_data_message_panel.clear();
        },
        RemoveDownloadWindow: function(){
            d.map.main.remove(w.panel_gui.download_data_panel);
            w.panel_gui.download_data_panel.clear();
        },
    },
    Reset: {
        ClearMenus : function(){
            Object.keys(w.panel_gui).forEach( function(key){ w.panel_gui[key].clear() });
        },
        MapLayers : function(){
            d.map.main.layers().forEach( function(obj){ d.map.main.remove(obj) });
        },
        MainMenu : function(){
            w.panel_gui.menu_main.clear();
            w.panel_gui.menu_main.add( w.label.main_menu_title);
            w.panel_gui.menu_main.add( w.label.main_menu_text);
            w.panel_gui.menu_main.add( w.label.sub_menu_1);
            w.panel_gui.menu_main.add( w.label.sub_menu_1_spiel);
            w.panel_gui.menu_main.add( w.button.sub_menu_1_menu );
            w.panel_gui.menu_main.add( w.label.sub_menu_2);
            w.panel_gui.menu_main.add( w.label.sub_menu_2_spiel);
            w.panel_gui.menu_main.add( w.button.sub_menu_2_menu );
            d.map.main.addLayer(d.fc.ofs_list, {color: '#FC8E08'}, 'OFS');
        },
        SetImageCollection: function(){
            w.panel_gui.set_image_collection.clear();
            w.panel_gui.set_ic.clear();
            w.panel_gui.set_image_collection.add( w.label.refine_ic );
            w.panel_gui.set_image_collection.add( w.select.ic_sources );
            w.panel_gui.set_ic.add( w.panel_gui.set_image_collection );
        },
        SetImageComparisonDates: function(){
            w.panel_gui.date_first_start.clear();
            w.panel_gui.date_first_end.clear();
            w.panel_gui.date_first_start.add( w.label.set_start_date );
            w.panel_gui.date_first_start.add(w.slider.period_slider_1);
            w.panel_gui.date_first_end.add( w.label.set_end_date );
            w.panel_gui.date_first_end.add(w.slider.period_slider_2);
            w.panel_gui.date_first.add( w.panel_gui.date_first_start );
            w.panel_gui.date_first.add( w.panel_gui.date_first_end );
        },
        SetParamsSlider: function(){
            w.panel_gui.set_params_slider.clear();
            w.panel_gui.set_params_slider.add(w.slider.mNDWI_threshold);
            w.panel_gui.set_params_slider.add( w.label.params_slider );
        },
        Main: function(){
            f.Reset.ClearMenus();
            if(d.str.gui_menu_current=="MAIN"){
                f.Reset.MainMenu();
            }
            if(d.str.gui_menu_current=="MENU_1"){
                w.panel_gui.menu_main.add( w.label.sub_menu_1_title );
                
                // Add the collection selection here
                // f.Reset.SetImageCollection();
                // w.panel_gui.menu_main.add( w.label.set_image_collection );
                // w.panel_gui.menu_main.add( w.panel_gui.set_ic );

                f.Reset.SetImageComparisonDates();
                d.map.main.onClick( f.ui.click_OFS_show_ts );
                // w.panel_gui.menu_main.add( w.label.set_first_image );
                w.panel_gui.menu_main.add( w.panel_gui.date_first );
                // w.panel_gui.menu_main.add( w.label.set_second_image );
                // w.panel_gui.menu_main.add( w.panel_gui.date_first );

                w.panel_gui.set_menu_buttons.clear()
                w.panel_gui.set_menu_buttons.add(w.button.main_menu);
                w.panel_gui.menu_main.add(w.panel_gui.set_menu_buttons);
            }

            if(d.str.gui_menu_current=="MENU_2"){
                w.panel_gui.menu_main.add( w.label.sub_menu_2_title );
                
                f.Reset.SetImageCollection();
                w.panel_gui.menu_main.add( w.label.set_image_collection );
                w.panel_gui.menu_main.add( w.label.warning_message );
                w.panel_gui.menu_main.add( w.panel_gui.set_ic );

                f.Reset.SetImageComparisonDates();
                w.panel_gui.menu_main.add( w.panel_gui.date_first );

                f.Reset.SetParamsSlider();
                w.panel_gui.menu_main.add(w.panel_gui.set_params_slider);


                w.panel_gui.set_menu_buttons.clear();
                w.panel_gui.set_menu_buttons.add(w.button.main_menu);
                w.panel_gui.set_menu_buttons.add(w.button.show_tailored_params_OFS);
                w.panel_gui.menu_main.add(w.panel_gui.set_menu_buttons);
            }

            // todo:
            // if(d.str.gui_menu_current=="MONTHLY"){}
            // if(d.str.gui_menu_current=="ANNUAL"){}
            w.panel_gui.background.add( w.panel_gui.menu_main );
            
        },
    },
    Trigger: {
        SetMenuPrevious : function(){
            d.str.gui_menu_current = d.str.gui_menu_previous;
            f.Reset.Main();
        },
        SetMenuMain : function(){
            d.str.gui_menu_current = 'MAIN';
            f.ui.RemoveOFStsChart();
            f.Reset.MapLayers();
            f.ClearLegends();
            f.Reset.Main();
        },
        SetMenu1 : function(){
            "DEBUG"
            d.str.gui_menu_current = 'MENU_1';
            d.str.gui_menu_previous = 'MENU_1';
            f.Reset.Main();
        },
        SetMenu2: function(){
            "DEBUG"
            d.str.gui_menu_current = 'MENU_2';
            d.str.gui_menu_previous = 'MENU_2';
            f.Reset.Main();
        },
    },
    ClearLegends : function(){
        d.map.main.remove( w.panel_nongui.legends );
        w.panel_nongui.legends.clear();
        var keys = Object.keys(d.legend);
        for( var idx=0; idx<keys.length; idx++ ){
          var key = keys[idx];
          d.legend[key] = null
        }
    },
};

var w = {
    label: {
        main_menu_title: ui.Label( 'OFS Monitoring', d.dct.style.main_header ),
        main_menu_text : ui.Label( 'Monitoring OFS time series variations and tuning parameters' ),
        sub_menu_1: ui.Label( 'OFS time series visual & download', d.dct.style.sub_header ),
        sub_menu_1_spiel : ui.Label( 'Visualise OFS time series visual and download the csv files' ),
        sub_menu_2: ui.Label( 'OFS parameters tuning', d.dct.style.sub_header ),
        sub_menu_2_spiel : ui.Label( 'Observe the OFS difference when using different mNDWI thresholds' ),
        sub_menu_1_title : ui.Label( "OFS time series visual & download",  d.dct.style.main_header ),
        sub_menu_2_title : ui.Label( "OFS parameters tuning",  d.dct.style.main_header ),
        set_image_collection : ui.Label( "Set up parameters", d.dct.style.sub_header ),
        warning_message: ui.Label('Please keep a smaller mapping area or shorter time period in case of computation timed out.', d.dct.style.warning_message),
        refine_ic : ui.Label( {value:"Set Source: ", style:{position:'middle-left', backgroundColor: '#EEEEFF'}} ),
        set_start_date : ui.Label( "Set start observation date", d.dct.style.date_label ),
        set_end_date : ui.Label( "Set end observation date", d.dct.style.date_label ),
        no_data_message: ui.Label('No data available, please select another OFS or time period', d.dct.style.text_message),
        no_data_message1: ui.Label('No data available, please adjust the mapping area, or select another dataset or time period', d.dct.style.text_message),
        params_slider: ui.Label( {value:"Binary threshold for mNDWI (Pixel values larger than this threshold represent water)", style:{position:'middle-left', backgroundColor: '#FFF8EE'}} ),

    },
    button: {
        sub_menu_1_menu : ui.Button({ label: "OFS time series visual & download", onClick:f.Trigger.SetMenu1, disabled:false }),
        sub_menu_2_menu : ui.Button({ label: "OFS parameters tuning", onClick:f.Trigger.SetMenu2, disabled:false }),
        main_menu : ui.Button({ label: "Main Menu", onClick:f.Trigger.SetMenuMain, disabled:false, style:{width:"125px", position:'middle-right'} }),
        remove_ofs_ts_chart: ui.Button({ label: "Close the chart", onClick:f.ui.RemoveOFStsChart, disabled:false, style:{width:'100px'} }),
        close_message : ui.Button({ label: "Close the message", onClick:f.ui.RemoveMessage, disabled:false }),
        close_download_window: ui.Button({ label: "Close the window", onClick:f.ui.RemoveDownloadWindow, disabled:false }),
        show_tailored_params_OFS: ui.Button({ label: "Show the OFS", onClick:f.ui.tailor_OFS_params, disabled:false, style:{width:"125px", position:'middle-left'} }),
        download_data : ui.Button({ label: "Download Data", onClick:f.Trigger.SetMenuDownload, disabled:false, style:{width:"125px", position:'middle-right'} }),
    },
    panel_gui: {
        background : ui.Panel({
            layout: 'flow',
            style: {height: '650px', width: '350px', position: 'bottom-right', backgroundColor: 'rgba(255,255,255,0.8)'}
        }),
        menu_main: ui.Panel({
                    layout: 'flow',
                    style: {height: '650px', width: '350px', position: 'bottom-right'}
        }),
        set_image_collection : ui.Panel( {layout: ui.Panel.Layout.absolute(),
            style: { height: '62px',
                     width: '230px',
                     backgroundColor: '#EEEEFF',
                     margin: '-10px 0px 0px 0px'
                    },
        } ),
        set_ic : ui.Panel( {layout: ui.Panel.Layout.flow('vertical'),
            style: { height: '55px',
            width: '290px',
            stretch: 'horizontal',
            backgroundColor: '#EEEEFF',
            margin: '10px 10px 10px 10px'
            },
        } ),
        set_menu_buttons : ui.Panel( {layout: ui.Panel.Layout.absolute(),
            style: {
                height: '62px',
                width: '290px',
                backgroundColor: '#FFFFFF',
                margin: '-10px 0px 0px 0px',
            },
        } ),
        date_first : ui.Panel( {layout: ui.Panel.Layout.flow('vertical'),
            style: { height: '300px',
                     width: '300px',
                     stretch: 'horizontal',
                     backgroundColor: '#EEFFEE',
                     margin: '10px 10px 10px 10px'
                    },
        } ),
        date_first_start : ui.Panel( {layout: ui.Panel.Layout.flow('horizontal'),
        style: {
        // height: '145px',
        // width: '300px',
        stretch: 'horizontal',
        backgroundColor: '#EEFFEE',
        margin: '1px 1px 1px 1px'},
        } ),
        date_first_end : ui.Panel( {layout: ui.Panel.Layout.flow('horizontal'),
        style: { 
        // height: '145px',
        // width: '300px',
        stretch: 'horizontal',
        backgroundColor: '#EEFFEE',
        margin: '1px 1px 1px 1px'},
        } ),
        set_params_slider: ui.Panel({layout: ui.Panel.Layout.absolute(),
        style: {
        height: '100px',
        width: '290px',
        // stretch: 'horizontal',
        backgroundColor: '#FFF8EE',
        margin: '10px 10px 10px 10px'},
        }),
        download_data_panel: ui.Panel({layout: ui.Panel.Layout.flow('vertical'),
        style: {
            height: '100px',
            width: '180px',
            backgroundColor: '#FFFFFF',
            margin: '10px 10px 10px 10px',
            border: '1px solid black'}
        }),
    },
    panel_nongui : {
        no_data_message_panel: ui.Panel({
            layout: ui.Panel.Layout.flow('vertical'), 
            style: { height: '100px',
            width: '650px',
            stretch: 'horizontal',
            backgroundColor: '#FFFFFF',
            margin: '10px 10px 10px 10px',
            border: '1px solid black'},
        }),
        ofs_ts_chart: ui.Panel({
            layout: ui.Panel.Layout.flow('vertical'), 
            style: { height: '300px',
            width: '900px',
            stretch: 'horizontal',
            backgroundColor: '#FFFFFF',
            margin: '10px 10px 10px 10px',
            border: '1px solid black'},
        }),
        legends : ui.Panel( {layout: ui.Panel.Layout.flow('vertical'),
        style: { width: '250px',
        stretch: 'vertical',
        backgroundColor: '#FFFFFF',
        margin: '10px 10px 10px 10px',
        border: '1px solid black',
        position: 'bottom-right'},
        } )
    },
    select: {
        // ic_sources : ui.Select({ items:d.ic_sources, value:d.str.selected_ic, onChange: function(){d.str.selected_ic = w.select.ic_sources.getValue()}, disabled:false, style:{width:'100px',position:'middle-right',backgroundColor: '#EEEEFF',}}),
        
        ic_sources : ui.Select({ items:Object.keys(d.ic_sources), value:d.str.selected_ic, onChange: function(){d.str.selected_ic = w.select.ic_sources.getValue()}, disabled:false, style:{width:'100px',position:'middle-right',backgroundColor: '#EEEEFF',}}),
    },
    slider: {
        period_slider_1: ui.DateSlider({
            start: ee.Date('1986-01-01'),
            end: new Date(),
            value: ee.Date('2015-06-23'),
            period: 1,
            style: d.dct.style.slider,
        }),
        period_slider_2: ui.DateSlider({
            start: ee.Date('1986-01-01'),
            end: new Date(),
            value: ee.Date('2016-12-31'),
            period: 1,
            style: d.dct.style.slider,
        }),
        // TODO: check water_monitoring.js Line 990
        mNDWI_threshold : ui.Slider({
            min:0,
            max:0.5,
            value:0.1,
            step:0.1,
            style:{stretch: 'horizontal', backgroundColor: '#FFF8EE'}
        }),
    },
};

f.Init();
