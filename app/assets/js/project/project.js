
  var $map = $("#map");

  var map = new google.maps.Map($map[0], {
    zoom: 2,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: {
      lat: 33.045579573575154,
      lng: -96.97189523828126
    }
  });

  var overlay = new google.maps.OverlayView();

  d3.json("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(collection) {

    overlay.onAdd = function() {
      var layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "SvgOverlay");
      var svg = layer.append("svg");
      var quakes = svg.append("g").attr("class", "Quakes");

      overlay.draw = function() {
        var markerOverlay = this;
        var overlayProjection = markerOverlay.getProjection();

        // Turn the overlay projection into a d3 projection
        var googleMapProjection = function(coordinates) {
          var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
          var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
          return [pixelCoordinates.x + 4000, pixelCoordinates.y + 4000];
        }

        path = d3.geo.path().projection(googleMapProjection);

        quakes.selectAll("path")
          .data(collection.features)
          .attr("d", path.pointRadius(function(d) {
            return Math.sqrt((Math.exp(parseFloat(d.properties.mag))));
          }))
          .attr("class", "myPathClass")
          .enter().append("svg:path")
          .attr("d", path.pointRadius(function(d) { console.log(d.properties.mag)
            return Math.sqrt((Math.exp(parseFloat(d.properties.mag))));
          }))
          .on("mouseover", function(d) {
            var mousePosition = d3.svg.mouse(this);
            var format = d3.time.format("%Y-%m-%d %HH:%MM:%SS");
            $("#quake-pop-up").fadeOut(100, function() {
              // Popup content
              $("#quake-pop-up-title").html(format(new Date(parseInt(d.properties.time))));
              $("#quake-pop-img").html(d.properties.mag);
              $("#quake-pop-desc").html(d.properties.place);

              $("#quake-pop-up").css({
                "right": 0,
                "top": 50
              });
              $("#quake-pop-up").fadeIn(100);
            });
          }).
        on("mouseout", function() {
          //$("#quake-pop-up").fadeOut(50);
        });
      };
      createHistogram(collection, quakes);
    };

    overlay.setMap(map);

  });



function createHistogram(dataset, svgclass) {
  var formatCount = d3.format(",.0f");
  var values = dataset.features.map(function(d) {
    return d.properties.mag;
  });

  var margin = {
      top: 10,
      right: 30,
      bottom: 40,
      left: 30
    },
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain([0, 10])
    .range([0, width]);

  // Generate a histogram using twenty uniformly-spaced bins.
  var data = d3.layout.histogram()
    .bins(x.ticks(10))
    (values);

  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) {
      return d.y;
    })])
    .range([height, 0]);


  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

  var svgbar = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "hist")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svgbar.append("text")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("y", 5)
    .attr("x", 300)
    .attr("text-anchor", "middle")
    .text("Earthquakes over the past 30 days");

  var bar = svgbar.selectAll(".bar")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) {
      return "translate(" + x(d.x) + "," + y(d.y) + ")";
    })
    .on("mouseover", function(d, i) {
      d3.selectAll(".SvgOverlay path").filter(function(e) {
        return d3.min(d) <= e.properties.mag && e.properties.mag < d3.max(d)
      }).style({
        'fill': 'red',
        'stroke': 'yellow'
      })
    })
    .on("mouseout", function(d, i) {
      d3.selectAll(".SvgOverlay path").filter(function(e) {
        return d3.min(d) <= e.properties.mag && e.properties.mag < d3.max(d)
      }).style({
        'fill': '',
        'stroke': ''
      });
    });

  bar.append("rect")
    .attr("x", 1)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function(d) {
      return height - y(d.y);
    });

  bar.append("text")
    .attr("dy", ".75em")
    .attr("y", -10)
    .attr("x", x(data[0].dx) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.y);
    });

  svgbar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("font-size", "12px")
    .attr("y", 30)
    .attr("x", 200)
    .attr("text-anchor", "middle")
    .text("Magnitude");;

  return svgbar;
}

