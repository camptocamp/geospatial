/**
 * Available resolutions as defined in
 * https://api3.geo.admin.ch/services/sdiservices.html#wmts.
 * @const {!Array.<number>}
 */
const RESOLUTIONS = {
    "EPSG:21781": [
        4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
        1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25,
        0.1,
    ],
    "EPSG:2056": [
        4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
        1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25,
        0.1,
    ],
    "EPSG:4326": [
        0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
        0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
        0.001373291015625, 0.0006866455078125, 0.00034332275390625,
        0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125,
        0.000021457672119140625, 0.000010728836059570312,
        0.000005364418029785156, 0.000002682209014892578,
    ],
    "EPSG:3857": [
        4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
        1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25,
        0.1,
    ],
};

const ATTRIBUTIONS =
    '<a target="_blank" href="https://www.swisstopo.admin.ch">swisstopo</a>';

/**
 * Extents of Swiss projections. (EPSG:21781)
 */
const EXTENTS = {
    "EPSG:21781": [420000, 30000, 900000, 350000],
    "EPSG:2056": [2420000, 1030000, 2900000, 1350000],
    "EPSG:4326": [90, -180, -90, 180],
    //"EPSG:4326": [5.140242, 45.398181, 11.47757, 48.230651],
    "EPSG:3857": [
        20037508.342789244, -20037508.342789244, -20037508.342789244,
        20037508.342789244,
    ],
};
const EXTENTS_2 = {
    "EPSG:21781": [420000, 30000, 900000, 350000],
    "EPSG:2056": [2420000, 1030000, 2900000, 1350000],
    //"EPSG:4326": [90, -180, -90, 180],
    "EPSG:4326": [5.140242, 45.398181, 11.47757, 48.230651],
    "EPSG:3857": [
        20037508.342789244, -20037508.342789244, -20037508.342789244,
        20037508.342789244,
    ],
};
const PROJECTION_DEFINITIONS = {
    "EPSG:21781": [
        "+proj=somerc",
        "+lat_0=46.95240555555556",
        "+lon_0=7.439583333333333",
        "+k_0=1",
        "+x_0=600000",
        "+y_0=200000",
        "+ellps=bessel",
        "+towgs84=674.4,15.1,405.3,0,0,0,0",
        "+units=m",
        "+no_defs",
    ].join(" "),
    "EPSG:2056": [
        "+proj=somerc",
        "+lat_0=46.95240555555556",
        "+lon_0=7.43958333333333",
        "+k_0=1",
        "+x_0=2600000",
        "+y_0=1200000",
        "+ellps=bessel",
        "+towgs84=674.374,15.056,405.346,0,0,0,0",
        "+units=m",
        "+no_defs",
        "+type=crs",
    ].join(" "),
    "EPSG:4326": [
        "+proj=longlat",
        "+datum=WGS84",
        "+no_defs",
        "+type=crs",
    ].join(" "),
    "EPSG:3857": [
        "+proj=merc",
        "+a=6378137",
        "+b=6378137",
        "+lat_ts=0",
        "+lon_0=0",
        "+x_0=0",
        "+y_0=0",
        "+k=1",
        "+units=m",
        "+nadgrids=@null",
        "+wktext",
        "+no_defs",
        "+type=crs",
    ].join(" "),
};

const DEFAULT_PROJECTION_CODE = "EPSG:2056";

function init_proj4(self) {
    // Adding proj4
    self.jsLibs.push("/geoengine_swisstopo/static/lib/proj4.js");
}

function define_projections() {
    // add the required projections to allow conversions
    for (let code in PROJECTION_DEFINITIONS) {
        if (!ol.proj.get(code)) {
            proj4.defs(code, PROJECTION_DEFINITIONS[code]);
        }
    }

    ol.proj.proj4.register(proj4);
}

odoo.define("geoengine_swisstopo.projection_EPSG_4326", function (require) {
    "use strict";

    let GeoengineWidgets = require("base_geoengine.geoengine_widgets");
    let GeoengineView = require("base_geoengine.GeoengineView");

    GeoengineWidgets.FieldGeoEngineEditMap.include({
        init: function (parent) {
            this._super.apply(this, arguments);
            init_proj4(this);
        },
        _render: function (parent) {
            define_projections();
            this._super.apply(this, arguments);
        },

    });
    GeoengineView.include({
        init: function (parent) {
            this._super.apply(this, arguments);
            init_proj4(this);
        },
        _render: function (parent) {
            define_projections();
            this._super.apply(this, arguments);
        },
    });
});
odoo.define("geoengine_swisstopo.projection_EPSG_21781", function (require) {
    "use strict";

    let GeoengineWidgets = require("base_geoengine.geoengine_widgets");
    let GeoengineView = require("base_geoengine.GeoengineView");

    GeoengineWidgets.FieldGeoEngineEditMap.include({
        init: function (parent) {
            this._super.apply(this, arguments);
            init_proj4(this);
        },
        _render: function (parent) {
            define_projections();
            this._super.apply(this, arguments);
        },
    });
    GeoengineView.include({
        init: function (parent) {
            this._super.apply(this, arguments);
            init_proj4(this);
        },
        _render: function (parent) {
            define_projections();
            this._super.apply(this, arguments);
        },

    });
});


odoo.define('geoengine_swisstopo.BackgroundLayers', function (require) {
    "use strict";

    let BackgroundLayers = require("base_geoengine.BackgroundLayers");

    BackgroundLayers.include({
        createTileGrid: function (projection) {
            return new ol.tilegrid.WMTS({
                extent: EXTENTS_2[projection],
                resolutions: RESOLUTIONS[projection],
                matrixIds: RESOLUTIONS[projection].map(function (item, index) {
                    return String(index);
                }),
                origins: RESOLUTIONS[projection].map(function (item, index) {
                    return [EXTENTS[projection][1], EXTENTS[projection][0]];
                }),
                tileSizes: RESOLUTIONS[projection].map(function (item, index) {
                    return 256;
                }),
            });
        },

        handleCustomLayers: function (l) {
            define_projections();
            let out = this._super.apply(this, arguments);
            if (l.raster_type == "swisstopo") {
                let format = l.format_suffix || "jpeg";
                let projection_code = l.projection || DEFAULT_PROJECTION_CODE;
                let projection = ol.proj.get(projection_code);
                let source = new ol.source.WMTS({
                    extent: EXTENTS_2[projection_code],
                    attributions: [
                        new ol.Attribution({
                            html: ATTRIBUTIONS,
                        })
                    ],
                    url: l.wmts_url,
                    //urls: Array [ "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/{Time}/4326/{TileMatrix}/{TileCol}/{TileRow}.jpeg" ]
                    // https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/4326/10/243/1077.jpeg
                    projection: projection,
                    requestEncoding: "REST",
                    version: "1.0.0",
                    //style: "default",​
                    style: "ch.swisstopo.pixelkarte-farbe",
                    layer: "ch.swisstopo.pixelkarte-farbe",
                    matrixSet: "4326_18",
                    format: "image/" + format,
                    tileGrid: this.createTileGrid(projection_code),
                    crossOrigin: "anonymous",
                });
                out.push(
                    new ol.layer.Tile({
                        title: l.name,
                        visible: !l.overlay,
                        type: "base",
                        source: source,
                    })
                );
            }
            return out;
        }
    });
});
