// var years_slider = new Slider(
//   "#years_slider", {
//     "id": "years_slider",
//     "min": 1870,
//     "max": 1910,
//     "range": true,
//     "value": [1870, 1910]
//   });


d3.json("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(remote_json) {

    window.remote_json = remote_json;

    d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);


    var width = 900,
        height = 900;

    //the scale corrsponds to the radius more or less so 1/2 width
    var projection = d3.geo.orthographic()
        .scale(300)
        .clipAngle(90)
        .translate([width / 2, height / 2]);

    var rScale = d3.scale.sqrt();
    // var canvas = d3.select("#globeParent").append("canvas")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .style("cursor", "move");

    // var c = canvas.node().getContext("2d");

    var path = d3.geo.path()
        .projection(projection);
        // .context(c);
    
    var svg = d3.select("body").append("svg")
            .attr("width", width + 1000)
            .attr("height", height + 1000)
            .on("mousedown", mousedown);

    var g = svg.append("g");

    var graticule = d3.geo.graticule();

    // g.append("path")
    //     .datum({type: "Sphere"})
    //     .attr("class", "sphere")
    //     .attr("d", path)
    //     .attr("fill", "#eeeeee");

    


    // var graticule = d3.geo.graticule();

    // var selectedCountryFill = "#007ea3",
    //     flightPathColor = "#007ea3",
    //     landFill = "#b9b5ad",
    //     seaFill = "#e9e4da";
    // var startCountry = "Australia";
    // var endCountry = "United Kingdom";

    //interpolator from http://bl.ocks.org/jasondavies/4183701
    // var d3_geo_greatArcInterpolator = function() {
    //     var d3_radians = Math.PI / 180;
    //     var x0, y0, cy0, sy0, kx0, ky0,
    //         x1, y1, cy1, sy1, kx1, ky1,
    //         d,
    //         k;

    //     function interpolate(t) {
    //         var B = Math.sin(t *= d) * k,
    //             A = Math.sin(d - t) * k,
    //             x = A * kx0 + B * kx1,
    //             y = A * ky0 + B * ky1,
    //             z = A * sy0 + B * sy1;
    //         return [
    //             Math.atan2(y, x) / d3_radians,
    //             Math.atan2(z, Math.sqrt(x * x + y * y)) / d3_radians
    //         ];
    //     }

    //     interpolate.distance = function() {
    //         if (d == null) k = 1 / Math.sin(d = Math.acos(Math.max(-1, Math.min(1, sy0 * sy1 + cy0 * cy1 * Math.cos(x1 - x0)))));
    //         return d;
    //     };

    //     interpolate.source = function(_) {
    //         var cx0 = Math.cos(x0 = _[0] * d3_radians),
    //             sx0 = Math.sin(x0);
    //         cy0 = Math.cos(y0 = _[1] * d3_radians);
    //         sy0 = Math.sin(y0);
    //         kx0 = cy0 * cx0;
    //         ky0 = cy0 * sx0;
    //         d = null;
    //         return interpolate;
    //     };

    //     interpolate.target = function(_) {
    //         var cx1 = Math.cos(x1 = _[0] * d3_radians),
    //             sx1 = Math.sin(x1);
    //         cy1 = Math.cos(y1 = _[1] * d3_radians);
    //         sy1 = Math.sin(y1);
    //         kx1 = cy1 * cx1;
    //         ky1 = cy1 * sx1;
    //         d = null;
    //         return interpolate;
    //     };

    //     return interpolate;
    // }
    queue()
        .defer(d3.json, "http://raw.githubusercontent.com/mbostock/topojson/master/examples/world-110m.json")
        .defer(d3.json, "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
        .await(ready);

    function ready(error, world, places) {
        if (error) throw error;

        var ocean_fill = svg.append("defs").append("radialGradient")
          .attr("id", "ocean_fill")
          .attr("cx", "75%")
          .attr("cy", "25%");
        ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "#ddf");
        ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "#9ab");

        var globe_highlight = svg.append("defs").append("radialGradient")
        .attr("id", "globe_highlight")
        .attr("cx", "75%")
        .attr("cy", "25%");
        globe_highlight.append("stop")
        .attr("offset", "5%").attr("stop-color", "#ffd")
        .attr("stop-opacity","0.6");
        globe_highlight.append("stop")
        .attr("offset", "100%").attr("stop-color", "#ba9")
        .attr("stop-opacity","0.2");

        var globe_shading = svg.append("defs").append("radialGradient")
        .attr("id", "globe_shading")
        .attr("cx", "50%")
        .attr("cy", "40%");
        globe_shading.append("stop")
        .attr("offset","50%").attr("stop-color", "#9ab")
        .attr("stop-opacity","0")
        globe_shading.append("stop")
        .attr("offset","100%").attr("stop-color", "#3e6184")
        .attr("stop-opacity","0.3")

        var drop_shadow = svg.append("defs").append("radialGradient")
        .attr("id", "drop_shadow")
        .attr("cx", "50%")
        .attr("cy", "50%");
        drop_shadow.append("stop")
        .attr("offset","20%").attr("stop-color", "#000")
        .attr("stop-opacity",".5")
        drop_shadow.append("stop")
        .attr("offset","100%").attr("stop-color", "#000")
        .attr("stop-opacity","0")  

        svg.append("ellipse")
        .attr("cx", width / 2).attr("cy", 450)
        .attr("rx", projection.scale()*.90)
        .attr("ry", projection.scale()*.25)
        .attr("class", "noclicks")
        .style("fill", "url(#drop_shadow)");

        svg.append("circle")
        .attr("cx", width / 2).attr("cy", height / 2)
        .attr("r", projection.scale())
        .attr("class", "noclicks")
        .style("fill", "url(#ocean_fill)");

        svg.append("path")
        .datum(topojson.object(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

        svg.append("path")
        .datum(graticule)
        .attr("class", "graticule noclicks")
        .attr("d", path);

        svg.append("circle")
        .attr("cx", width / 2).attr("cy", height / 2)
        .attr("r", projection.scale())
        .attr("class","noclicks")
        .style("fill", "url(#globe_highlight)");

        svg.append("circle")
        .attr("cx", width / 2).attr("cy", height / 2)
        .attr("r", projection.scale())
        .attr("class","noclicks")
        .style("fill", "url(#globe_shading)");

        
        // magnitude_array = [];
        // for (i = 0; i < remote_json.features.length; i++) {
        //     if (remote_json.features[i].hasOwnProperty("mag")){
        //         magnitude_array.push(remote_json.features[i].properties.mag);
        //     }
            
        //  }
        // for (i = 0; i < magnitude_array.length; i++) {
        //     console.log(magnitude_array[i])
            
        //  }



        svg.append("g").attr("class","points")
        .selectAll("text").data(places.features)
        .enter().append("path")
        .attr("class", "point")
        .attr("d", path.pointRadius(function(d){
            // console.log(d.properties.mag)
            return d.properties ? Math.sqrt((Math.exp((d.properties.mag)))) : 1;
        }))
        .style("fill", "red");

        svg.append("g").attr("class","labels")
        .selectAll("text").data(places.features)
        .enter().append("text")
        .attr("class", "label")
        .text(function(d) { return d.properties.place })

        svg.append("g").attr("class","countries")
      .selectAll("path")
        .data(topojson.object(world, world.objects.countries).geometries)
      .enter().append("path")
        .attr("d", path)
        .text(function(d) { return d.properties.place });

        position_labels();

    }

    function position_labels() {
  var centerPos = projection.invert([width/2,height/2]);

  var arc = d3.geo.greatArc();

  svg.selectAll(".label")
    .attr("text-anchor",function(d) {
      var x = projection(d.geometry.coordinates)[0];
      return x < width/2-20 ? "end" :
             x < width/2+20 ? "middle" :
             "start"
    })
    .attr("transform", function(d) {
      var loc = projection(d.geometry.coordinates),
        x = loc[0],
        y = loc[1];
      var offset = x < width/2 ? -5 : 5;
      return "translate(" + (x+offset) + "," + (y-2) + ")"
    })
    .style("display",function(d) {
      var d = arc.distance({source: d.geometry.coordinates, target: centerPos});
      return (d > 1.57) ? 'none' : 'inline';
    })
    
}

      //   svg.append("g").attr("class","labels")
      //   .selectAll("text").data(places.features)
      // .enter().append("text")
      // .attr("class", "label")
      // .text(function(d) { return d.properties.name })


        // g.selectAll("path.places").data(remote_json.features)
        // .enter().append("path")
        // .attr("class", "places")
        // .attr("d", path)
        // .attr("fill", "black")
        // .attr("fill-opacity", 0.8);
        // }


        // basic vars used in drawing
    //     var globe = { type: "Sphere" },
    //         land = topojson.feature(world, world.objects.land),
    //         // countries = remote_json.feature(world, world.objects.countries).features,
    //         places = remote_json.features;
    //         borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
    //         i = -1;
    //         console.log(places.length)
    //         n = places.length;

    //     // re-render your globe
    //     var redrawGlobe = function() {
    //         c.clearRect(0, 0, width, height);
    //         //base globe
    //         c.shadowBlur = 0, c.shadowOffsetX = 0, c.shadowOffsetY = 0;
    //         c.fillStyle = seaFill, c.beginPath(), path(globe), c.fill();
    //         c.fillStyle = landFill, c.beginPath(), path(land), c.fill();
    //         c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
    //     }

    //     // console.log(places)
    //     var points = []
    //     for (var count = 0; count < places.length; count++) {
    //         var coordinate = remote_json.features[count].geometry.coordinates;
    //         points.push([coordinate[0], coordinate[1]])
    //         // console.log(coordinates)

    //     }
    //      // canvas.selectAll("circle")
    //      //    .data([points]).enter()
    //      //    .append("circle")
    //      //    .attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
    //      //    .attr("cy", function (d) { return projection(d)[1]; })
    //      //    .attr("r", "1px")
    //      //    .attr("fill", "red");
    //     // console.log(remote_json.features.geometry)

    //     // canvas.selectAll(".pin")
    //     // .data(window.remote_json)
    //     // .enter().append("circle", ".pin")
    //     // .attr("r", 0.5)
    //     // .attr("transform", function(d) {
    //     //     return "translate(" + projection([
    //     //     d.features.geometry.coordinates[0],
    //     //     d.features.geometry.coordinates[1]
    //     //     ]) + ")";
    //     // });
    //     // canvas.append("path")
    //     //     .datum(graticule)
    //     //     .attr("class", "graticule noclicks")
    //     //     .attr("d", path);

    //     // canvas.append("g").attr("class","points")
    //     //     .selectAll("text").data(places.features)
    //     //   .enter().append("path")
    //     //     .attr("class", "point")
    //     //     .attr("d", path);

    //     //letting you drag the globe around but setting it so you can't tilt the globe over
    //     var dragBehaviour = d3.behavior.drag()
    //         .on('drag', function() {
    //             var dx = d3.event.dx;
    //             var dy = d3.event.dy;

    //             var rotation = projection.rotate();
    //             var radius = projection.scale();
    //             var scale = d3.scale.linear()
    //                 .domain([-1 * radius, radius])
    //                 .range([-90, 90]);
    //             var degX = scale(dx);
    //             var degY = scale(dy);
    //             rotation[0] += degX;
    //             rotation[1] -= degY;
    //             if (rotation[1] > 90) rotation[1] = 90;
    //             if (rotation[1] < -90) rotation[1] = -90;

    //             if (rotation[0] >= 180) rotation[0] -= 360;
    //             projection.rotate(rotation);
    //             redrawGlobe();
    //         })

    //     // draw globe
    //     redrawGlobe();

    //     // add event handler
    //     d3.select("#globeParent").select('canvas').call(dragBehaviour);

    // }
    var m0, o0;
function mousedown() {
  m0 = [d3.event.pageX, d3.event.pageY];
  o0 = projection.rotate();
  d3.event.preventDefault();
}
function mousemove() {
  if (m0) {
    var m1 = [d3.event.pageX, d3.event.pageY]
      , o1 = [o0[0] + (m1[0] - m0[0]) / 6, o0[1] + (m0[1] - m1[1]) / 6];
    o1[1] = o1[1] > 30  ? 30  :
            o1[1] < -30 ? -30 :
            o1[1];
    projection.rotate(o1);
    refresh();
  }
}
function mouseup() {
  if (m0) {
    mousemove();
    m0 = null;
  }
}

function refresh() {
  svg.selectAll(".land").attr("d", path);
  svg.selectAll(".countries path").attr("d", path);
  svg.selectAll(".graticule").attr("d", path);
  svg.selectAll(".point").attr("d", path);
  position_labels();
}




});