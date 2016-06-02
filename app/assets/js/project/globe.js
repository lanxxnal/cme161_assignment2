var years_slider = new Slider(
  "#years_slider", {
    "id": "years_slider",
    "min": 1870,
    "max": 1910,
    "range": true,
    "value": [1870, 1910]
  });


var width = 400,
    height = 400;

//the scale corrsponds to the radius more or less so 1/2 width
var projection = d3.geo.orthographic()
    .scale(180)
    .clipAngle(90)
    .translate([width / 2, height / 2]);

var canvas = d3.select("#globeParent").append("canvas")
    .attr("width", width)
    .attr("height", height)
    .style("cursor", "move");

var c = canvas.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection)
    .context(c);

var selectedCountryFill = "#007ea3",
    flightPathColor = "#007ea3",
    landFill = "#b9b5ad",
    seaFill = "#e9e4da";
var startCountry = "Australia";
var endCountry = "United Kingdom";

//interpolator from http://bl.ocks.org/jasondavies/4183701
var d3_geo_greatArcInterpolator = function() {
    var d3_radians = Math.PI / 180;
    var x0, y0, cy0, sy0, kx0, ky0,
        x1, y1, cy1, sy1, kx1, ky1,
        d,
        k;

    function interpolate(t) {
        var B = Math.sin(t *= d) * k,
            A = Math.sin(d - t) * k,
            x = A * kx0 + B * kx1,
            y = A * ky0 + B * ky1,
            z = A * sy0 + B * sy1;
        return [
            Math.atan2(y, x) / d3_radians,
            Math.atan2(z, Math.sqrt(x * x + y * y)) / d3_radians
        ];
    }

    interpolate.distance = function() {
        if (d == null) k = 1 / Math.sin(d = Math.acos(Math.max(-1, Math.min(1, sy0 * sy1 + cy0 * cy1 * Math.cos(x1 - x0)))));
        return d;
    };

    interpolate.source = function(_) {
        var cx0 = Math.cos(x0 = _[0] * d3_radians),
            sx0 = Math.sin(x0);
        cy0 = Math.cos(y0 = _[1] * d3_radians);
        sy0 = Math.sin(y0);
        kx0 = cy0 * cx0;
        ky0 = cy0 * sx0;
        d = null;
        return interpolate;
    };

    interpolate.target = function(_) {
        var cx1 = Math.cos(x1 = _[0] * d3_radians),
            sx1 = Math.sin(x1);
        cy1 = Math.cos(y1 = _[1] * d3_radians);
        sy1 = Math.sin(y1);
        kx1 = cy1 * cx1;
        ky1 = cy1 * sx1;
        d = null;
        return interpolate;
    };

    return interpolate;
}


function ready(error, world, names) {
    if (error) throw error;

    // basic vars used in drawing
    var globe = { type: "Sphere" },
        land = topojson.feature(world, world.objects.land),
        countries = topojson.feature(world, world.objects.countries).features,
        i = -1;

    // re-render your globe
    var redrawGlobe = function() {
        c.clearRect(0, 0, width, height);
        //base globe
        c.shadowBlur = 0, c.shadowOffsetX = 0, c.shadowOffsetY = 0;
        c.fillStyle = seaFill, c.beginPath(), path(globe), c.fill();
        c.fillStyle = landFill, c.beginPath(), path(land), c.fill();
    }

    //letting you drag the globe around but setting it so you can't tilt the globe over
    var dragBehaviour = d3.behavior.drag()
        .on('drag', function() {
            var dx = d3.event.dx;
            var dy = d3.event.dy;

            var rotation = projection.rotate();
            var radius = projection.scale();
            var scale = d3.scale.linear()
                .domain([-1 * radius, radius])
                .range([-90, 90]);
            var degX = scale(dx);
            var degY = scale(dy);
            rotation[0] += degX;
            rotation[1] -= degY;
            if (rotation[1] > 90) rotation[1] = 90;
            if (rotation[1] < -90) rotation[1] = -90;

            if (rotation[0] >= 180) rotation[0] -= 360;
            projection.rotate(rotation);
            redrawGlobe();
        })

    // draw globe
    redrawGlobe();

    // add event handler
    d3.select("#globeParent").select('canvas').call(dragBehaviour);

}




queue()
    .defer(d3.json, "http://raw.githubusercontent.com/mbostock/topojson/master/examples/world-110m.json")
    .defer(d3.tsv, "http://raw.githubusercontent.com/KoGor/Maps.GeoInfo/master/world-country-names.tsv")
    .await(ready);

