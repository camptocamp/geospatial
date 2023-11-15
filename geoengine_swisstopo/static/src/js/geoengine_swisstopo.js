const ATTRIBUTIONS =
    '<a target="_blank" href="https://www.swisstopo.admin.ch">swisstopo</a>';

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

    //ol.proj.proj4.register(proj4);
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
odoo.define("geoengine_swisstopo.projection_EPSG_2056", function (require) {
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
odoo.define("geoengine_swisstopo.projection_EPSG_3857", function (require) {
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
                let options = ol.source.WMTS.optionsFromCapabilities(
                    new ol.format.WMTSCapabilities().read(l.capabilities),
                    {
                        crossOrigin: "anonymous",
                        layer: l.layername,
                        projection: projection_code,
                        format: `image/${format}`,
                    },
                );
                if (!options) {
                    console.error("the layer is not in the capabilities");
                    return out;
                }
                if (l.time && options.dimensions.Time) {
                    options.dimensions.Time = l.time;
                }
                options.attributions = [
                    new ol.Attribution({
                        html: ATTRIBUTIONS,
                    }),
                ];

                let source = new ol.source.WMTS(options);
                out.push(
                    new ol.layer.Tile({
                        title: l.name,
                        visible: !l.overlay,
                        type: "base",
                        source: source,
                    }),
                );
            }
            return out;
        }
    });
});
