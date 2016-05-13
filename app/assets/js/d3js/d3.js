var DataSet = function() {
  this.data = {
    "items": {
      "item": [{
          "id": "0001",
          "type": "donut",
          "name": "Cake",
          "ppu": 0.55,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, {
              "id": "1002",
              "type": "Chocolate"
            }, {
              "id": "1003",
              "type": "Blueberry"
            }, {
              "id": "1004",
              "type": "Devil's Food"
            }]
          },
          "topping": [{
            "id": "5001",
            "type": "None"
          }, {
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5005",
            "type": "Sugar"
          }, {
            "id": "5007",
            "type": "Powdered Sugar"
          }, {
            "id": "5006",
            "type": "Chocolate with Sprinkles"
          }, {
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }]
        }, {
          "id": "0002",
          "type": "donut",
          "name": "Raised",
          "ppu": 0.55,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }]
          },
          "topping": [{
            "id": "5001",
            "type": "None"
          }, {
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5005",
            "type": "Sugar"
          }, {
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }]
        },

        {
          "id": "0003",
          "type": "donut",
          "name": "Old Fashioned",
          "ppu": 0.55,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, {
              "id": "1002",
              "type": "Chocolate"
            }]
          },
          "topping": [{
            "id": "5001",
            "type": "None"
          }, {
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }]
        }, {
          "id": "0004",
          "type": "bar",
          "name": "Bar",
          "ppu": 0.75,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, ]
          },
          "topping": [{
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }],
          "fillings": {
            "filling": [{
              "id": "7001",
              "name": "None",
              "addcost": 0
            }, {
              "id": "7002",
              "name": "Custard",
              "addcost": 0.25
            }, {
              "id": "7003",
              "name": "Whipped Cream",
              "addcost": 0.25
            }]
          }
        },

        {
          "id": "0005",
          "type": "twist",
          "name": "Twist",
          "ppu": 0.65,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, ]
          },
          "topping": [{
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5005",
            "type": "Sugar"
          }, ]
        },

        {
          "id": "0006",
          "type": "filled",
          "name": "Filled",
          "ppu": 0.75,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, ]
          },
          "topping": [{
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5007",
            "type": "Powdered Sugar"
          }, {
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }],
          "fillings": {
            "filling": [{
              "id": "7002",
              "name": "Custard",
              "addcost": 0
            }, {
              "id": "7003",
              "name": "Whipped Cream",
              "addcost": 0
            }, {
              "id": "7004",
              "name": "Strawberry Jelly",
              "addcost": 0
            }, {
              "id": "7005",
              "name": "Rasberry Jelly",
              "addcost": 0
            }]
          }
        }
      ]
    }
  }
};

var bake = (new DataSet()).data;
var node_list = [];

recipe = {
  name: "Recipe",
  _children: [{name:"Donut", _children:[bake.items.item[0], bake.items.item[1], bake.items.item[2]]}, bake.items.item[3], bake.items.item[4],bake.items.item[5]]
};

node_list.splice(0,0,recipe._children[0]);
node_list.splice(0, 0, recipe);



for (i of bake.items.item) {
	node_list.push(i);
  i._children = [];
  if (i.batters) {
    i._children.push({
      name: "Batters",
      _children: i.batters.batter
    });
    node_list.push(i._children[i._children.length - 1]);
//    for (var j of i._children[i._children.length - 1]._children) {
//      node_list.push(j);
//    }
  }
  
  if (i.topping) {
    i._children.push({
      name: "Toppings",
      _children: i.topping
    });
    node_list.push(i._children[i._children.length - 1]);
//    for (var j of i._children[i._children.length - 1]._children) {
  //    node_list.push(j);
//    }
  }
  
  if (i.fillings) {
    i._children.push({
      name: "Fillings",
      _children: i.fillings.filling
    });
    node_list.push(i._children[i._children.length - 1]);
//    for (var j of i._children[i._children.length - 1]._children) {
//      node_list.push(j);
//    }
  }
}

console.log(node_list);




var height = 2000,
  width = 1500;

var svg = d3
  .select("#hierarchy")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(50,0)");

var tree = d3
  .layout
  .tree()
  .size([0.5 * height, 0.5 * width]);

var diagonal = d3
  .svg
  .diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });


recipe.x0 = height / 2;
recipe.y0 = 0;


function findInPath(source, text) {
  if (source.name == text) {
    return true;
  } else if (source.children) {
    var c = source.children;
    for (var i = 0; i < c.length; i++) {
      if (findInPath(c[i], text)) {
        return true;
      }
    }
  } else if (source.parent) {
    if (source.parent.name == text) {
      return true;
    }
  }
  return false;
}

var filter = false;
var i = 0;
var duration = 650;


function update(source, filter_str = null) {
  var nodes = tree.nodes(recipe);
  var links = tree.links(nodes);
  console.log(nodes)
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) {
      return d.treeid || (d.treeid = ++i);
    });

  var nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0+ ")";
    })
    .on("click", click);

  nodeEnter.append("circle")
    .attr("r", 5)
    .style("fill", "white")
    .style("stroke", "plum")
    .style("stroke-width", "2.5px");

  nodeEnter.append("text")
    .text(function(d) {
      if (d.name) {
      	if(d.ppu){
        	return d.name + " (cost: $" + d.ppu + ")";
        }
        if(d.addcost){
        	return d.name + " (extra cost: $" + d.addcost + ")";
        }
        return d.name;
      } else {
            	if(d.ppu){
        	return d.type + " (cost: $" + d.ppu + ")";
        }
      if(d.addcost){
        	return d.type + " (extra cost: $" + d.addcost + ")";
        }
        return d.type;
      }
    })
    .attr("dx", "2.25em")
    .style("font", "10px sans-serif")
    .style("stroke", "black")
    .style("stroke-width", ".01px");

  var link = svg.selectAll("path.link")
    .data(links, function(d) {
      return d.target.treeid;
    });

  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    })


  var depthCount = function(branch) {
    if (!branch.children) {
      return 1;
    }
    return 1 + d3.max(branch.children.map(depthCount));
  }
  var max_depth = depthCount(recipe);
  var max_size = 14;

  var scale_circle_s = d3.scale.linear()
    .domain([1, max_depth])
    .range([max_size, 1]);

  var totalChildCount = function(root) {
    if (!root.children && !root._children) {
      return 0;
    }
    if (root.children) {
      return root.children.length + d3.sum(root.children.map(totalChildCount));
    }
    if (root._children) {
      return root._children.length + d3.sum(root._children.map(totalChildCount));
    }
  }

  var max_child = totalChildCount(recipe);
  var max_light = 1;
  var scale_circle_l = d3.scale.sqrt()
    .domain([1, max_child])
    .range([1, 0.4]);

  nodeUpdate.select("circle")
    .attr("r", function(d) {
      return scale_circle_s(d.depth);
    })
    .style("fill", function(d) {
      return d._children ? d3.hsl(340, 1, scale_circle_l(totalChildCount(d))) : d3.hsl(20, 1, scale_circle_l(totalChildCount(d)))
    })
    .style("stroke", "plum")
    .style("stroke-width", "2.5px")
    .style("visibility", "visible");

  link.style("visibility", "visible");

  var max_font = 15;
  var scale_font = d3.scale.linear()
    .domain([1, max_depth])
    .range([max_font, 5]);

  nodeUpdate.select("text")
    .style("fill-opacity", 1)
    .style("font", function(d) {
      return ((scale_font(d.depth)).toString().concat("px sans-serif"));
    })
    .style("fill", "purple")
    .style("stroke-width", ".01px")
    .style("visibility", "visible");


  if (filter == true) {
    nodeUpdate.select("circle")
      .filter(function(d) {
        return (!findInPath(d, filter_str))
      })
      .style("visibility", "hidden");

    nodeUpdate.select("text")
      .filter(function(d) {
        return (!findInPath(d, filter_str))
      })
      .style("visibility", "hidden");
    var linkFilter = function(d) {
      return findInPath(d.target, filter_str)
    }

    link.filter(function(d) {
        return !linkFilter(d)
      })
      .style("visibility", "hidden");
  }


  //--------------------------------------------------------------------------------------------------------------
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .style("fill", "none")
    .style("stroke", "#ccc")
    .style("stroke-width", "2.5px");

  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();
    
    nodes.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
});

  d3.select("svg")
    .call(d3.behavior.zoom()
      .scaleExtent([0.7, 1.5])
      .on("zoom", zoom));
}

function zoom() {
  var scale = d3.event.scale,
    translation = d3.event.translate,
    tbound = -height * scale,
    bbound = height * scale,
    lbound = (-width + 40) * scale,
    rbound = (width - 40) * scale;
  // limit translation to thresholds
  translation = [
    Math.max(Math.min(translation[0], rbound), lbound),
    Math.max(Math.min(translation[1], bbound), tbound)
  ];

  svg.attr("transform", "translate(" + translation + ")" +
    " scale(" + scale + ")");
}


function click(d) {
  if (!filter) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
}

var revert = function() {
  if (document.getElementById("revert").innerHTML == "Revert") {
    filter = false;
    update(recipe);
  }
}

var filter_batters = function() {
  if (document.getElementById("batters").innerHTML == "Filter for Batters") {
    filter = true;
    update(recipe, "Batters");
  }
}

var filter_toppings = function() {
  if (document.getElementById("toppings").innerHTML == "Filter for Toppings") {
    filter = true;
    update(recipe, "Toppings");
  }
}

var filter_fillings = function() {
  if (document.getElementById("fillings").innerHTML == "Filter for Fillings") {
    filter = true;
    update(recipe, "Fillings");
  }
}

document.getElementById('revert').addEventListener("click", revert);
document.getElementById('batters').addEventListener("click", filter_batters);
document.getElementById('toppings').addEventListener("click", filter_toppings);
document.getElementById('fillings').addEventListener("click", filter_fillings);



var index = 0;
var auto_draw = function() {
  if (index >= node_list.length) return;
  setTimeout(function() {
    node_list[index].children = node_list[index]._children;
    node_list[index]._children = null;
    update(recipe);
    console.log(recipe)
    index++;
    auto_draw();
  }, 600)
}

document.getElementById('auto-draw').addEventListener("click", auto_draw);

