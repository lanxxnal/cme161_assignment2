var hist = function(data_in, chart_id, value, chart_title) {
   //sort data
   data_in = data_in.sort(function (a, b) { return a.key < b.key ? -1 : 1; });
   var numOfBuckets = data_in.length+1;
  var margin = {
      "top": 30,
      "right": 30,
      "bottom": 50,
      "left": 50
    },
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, d3.max(data_in, function(d) {
      return d.value[value];
    })])
    .range([height, 0]);
    
  d3.select("#" + chart_id).remove();
  
  var div = d3.select("#magnitudeGraph").append("div").attr("id", chart_id);
  
  div.append("h4").text(chart_title);
  
  var svg = div.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
    .data(data_in)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) {
      return "translate(" + x(i / (numOfBuckets-1)) + "," + y(d.value[value]) + ")";
    });

  bar.append("rect")
    .attr("x", 5)
    .attr("width", (width / (numOfBuckets)))
    .attr("height", function(d) {
      return height - y(d.value[value]);
    });

  var formatCount = d3.format(",.0f");

  bar.append("text")
    .attr("dy", ".75em")
    .attr("y", -15)
    .attr("x", (width / (numOfBuckets - 1))/ 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.value.count);
    });
 // console.log(data_in);
  var unique_names = data_in.map(function(d) { 
    return d.key;
  });
  unique_names.push(unique_names[unique_names.length-1]+1);

  var xScale = d3.scale.ordinal().domain(unique_names).rangePoints([0, width]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

   var xTicks = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("transform", function(d) {
       return "rotate(0)"
    })
    .attr("y", 3)
    .attr("x", (width / (numOfBuckets- 1)) / 2)
    .attr("font-size", 10)
    .attr("text-anchor", "end");


  var yAxis = d3.svg.axis()
    .ticks(5)
    .scale(y)
    .orient("left");

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10);
}

d3.json("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(remote_json) {
    //SLIDER VALUES FOR THE GLOBE
    var minGlobalMagnitude = -10;
    var maxGlobalMagnitude = 10;
    var minGlobalDate = 0;
    var maxGlobalDate = Infinity;

    window.remote_json = remote_json;

    d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);


    var width = 700,
        height = 700;

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
    
    var svg = d3.select("#globeViz").append("svg")
            .attr("width", width)
            .attr("height", height)
            .on("mousedown", mousedown);

    var g = svg.append("g");

    var graticule = d3.geo.graticule();

    queue()
        .defer(d3.json, "http://raw.githubusercontent.com/mbostock/topojson/master/examples/world-110m.json")
        .defer(d3.json, "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson")
        .await(ready);

    function ready(error, world, places) {
        var dNow = new Date();
                
          //get the GeoJSON-features
          var quakes = places.features;
          quakes = quakes.filter(function(row){     
             //       console.log(row);
                return row.properties ? (row.properties.mag >= 0) : 1;
            });
          //make a new crossfilter from the features
          var earthquakes = crossfilter(quakes);

          //testing crossfilter by counting all features
          //var n = earthquakes.groupAll().reduceCount().value();
        //  console.log("There are " + n + " eathquakes within that file!")

          //get the 'magnitude'-dimension
          var dim_quakeMagnitude = earthquakes.dimension(function(d) {
            return Math.round(d.properties.mag);
          });

          var dim_quakeMagnitudeFilter = earthquakes.dimension(function(d) {
            return Math.round(d.properties.mag);
          });

          var dim_quakeTime = earthquakes.dimension(function(d) {
            return d.properties.time;
          });

        //  console.log(dim_quakeMagnitude.top(Infinity).length);
          var group_magniDimensions = dim_quakeMagnitude.group();
          group_magniDimensions.orderNatural();
        //  console.log(group_magniDimensions.top(Infinity));
          var reduce_init = function() {
            return {
              "count": 0
            };
          }

          var reduce_add = function(p, v, nf) {
            ++p.count;
            return p;
          }

          var reduce_remove = function(p, v, nf) {
            --p.count;
            return p;
          }

          group_magniDimensions.reduce(reduce_add, reduce_remove, reduce_init);

          var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)

          var render_plots = function() {
         //  console.log(group_magniDimensions.top(Infinity));
            hist(group_magniDimensions.top(Infinity), "quakesByMagnitude",
              "count", "# of Earthquakes per magnitude");

            //update globe
           // var quakesJson = JSON.parse(quakes);
            var updated_features = quakes.filter(function(row){     
             //       console.log(row);
                return row.properties ? (row.properties.mag >= minGlobalMagnitude && row.properties.mag <= maxGlobalMagnitude &&
                                        row.properties.time >= minGlobalDate && row.properties.time <= maxGlobalDate) : 1;
            });
          //  console.log(updated_features);
            svg.selectAll(".point").remove();
            svg.append("g").attr("class","points")
                .selectAll("text").data(updated_features)
                .enter().append("path")
                .attr("class", "point")
                .attr("d", path.pointRadius(function(d){
                    // console.log(d.properties.mag)
                    return d.properties ? Math.sqrt((Math.exp((d.properties.mag)))) : 1;
                }))
                .style("fill", "red")
                .on("mouseover", function(d) {
                var format = d3.time.format("%Y-%m-%d %HH:%MM:%SS");
              //  console.log(format(new Date(parseInt(d.properties.time))))
               // console.log(div)
                div.transition().duration(100).style("opacity", 0.9);
                div.html( "Place: " + d.properties.place + "<br>" +"Time: " + format(new Date(parseInt(d.properties.time)))
                    +"<br>" + "Magnitude: " + d.properties.mag)
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px"); 
                })
                .on("mouseout", function(d) {       
                div.transition()        
                    .duration(100)      
                    .style("opacity", 0);
                });
            
        
            position_labels();
                
          }

   
         
          var daysSlider = new Slider("#daysSlider", {
            "id": "daysSlider",
            "min": 0,
            "max": 30,
            "range": true,
            "value": [0, 30]
          });

          daysSlider.on("slide", function(e) {
            d3.select("#daysSlider_txt").text("min (ago): " + e[0] + ", max (ago): " + e[1]);
            // filter based on the UI element
            dim_quakeTime.filter(function(d) {
              var maxDate = new Date();
              maxDate.setDate(dNow.getDate() - e[0]);
              maxGlobalDate = Date.parse(maxDate);
              var minDate = new Date();
              minDate.setDate(dNow.getDate() - e[1]);
              minGlobalDate = Date.parse(minDate);
              return (d >= Date.parse(minDate) && d <= Date.parse(maxDate));
            });
            // re-render
            render_plots();
          });
          
          var magnitudeSlider = new Slider("#magnitudeSlider", {
            "id": "magnitudeSlider",
            "precision":1,
            "min": 0.0,
            "max": 10.0,
            "step" : 0.1,
            "range": true,
            "value": [0.0, 10.0]
          });
          
          magnitudeSlider.on("slide", function(e) {
            minGlobalMagnitude = e[0];
            maxGlobalMagnitude = e[1];
            d3.select("#magnitudeSliderGlobe_txt").text("GLOBE range (min: " + e[0] + ", max: " + e[1] + ")");
            var mingraphDisplay =  Math.floor(e[0])-0.5;
            if(mingraphDisplay < 0) mingraphDisplay = 0;
            var maxgraphDisplay =  Math.ceil(e[1]) - 0.5
            d3.select("#magnitudeSliderGraph_txt").text("GRAPH range (min: " + mingraphDisplay + ", max: " + maxgraphDisplay + ")");
            // filter based on the UI element
              dim_quakeMagnitudeFilter.filter([Math.floor(e[0])-0.001,Math.ceil(e[1])]);
            // re-render
            render_plots();
        });
        render_plots();


        //3D GLOBE DATA
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

        // add earthquake points on the globe
        svg.append("g").attr("class","point")
        .selectAll("text").data(places.features)
        .enter().append("path")
        .attr("class", "point")
        .attr("d", path.pointRadius(function(d){
            // console.log(d.properties.mag)
            return d.properties ? Math.sqrt((Math.exp((d.properties.mag)))) : 1;
        }))
        .style("fill", "red")
        .on("mouseover", function(d) {
            var format = d3.time.format("%Y-%m-%d %HH:%MM:%SS");
       //     console.log(format(new Date(parseInt(d.properties.time))))
        //    console.log(div)
            div.transition().duration(100).style("opacity", 0.9);
            div.html( "Place: " + d.properties.place + "<br>" +"Time: " + format(new Date(parseInt(d.properties.time)))
                +"<br>" + "Magnitude: " + d.properties.mag)
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px"); 
            })
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(100)      
                .style("opacity", 0);

        });
        
       // refresh();

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