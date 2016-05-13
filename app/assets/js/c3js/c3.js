var data = [
  ["Year", 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
  ["Deals", 1897, 2635, 3232, 3744, 5605, 8041, 4596, 3217, 3037, 3236, 3302, 3897, 4234, 4207, 3171, 3675, 4049, 3991, 4293, 4441, 4380]
];


var my_chart_parameters = {

  "data": {
  	"x": "Year",
    "columns": data,
    "selection": {
      "enabled": true
    }
  },
  "point": {
    "r": 5,
    "focus": {
      "expand": {
        "r": 7,
        "enabled": true
      }
    },
    "select": {
    	"r": 10
    }
  },
  "grid": {
    "x": {
      "show": false
    },
    "y": {
      "show": false
    }
  },
  "tooltip": {
    "show": false,
    "grouped": false
  }
};


var my_chart_object = c3.generate(my_chart_parameters);


var slide_0 = function() {
		my_chart_object.data.colors({
		  "Deals": d3.rgb('#669900'),
    });  
    document.getElementById("message").innerHTML = "Here is the number of venture capital investment deals in each of the past 21 years.";
};


var slide_1 = function() {
  my_chart_object.regions([{
   start: 1995,
   end: 2000,
  }]);
  document.getElementById("message").innerHTML = "With the advent of the web browser in 1993, Internet-based companies experienced steady commercial growth. Venture capital investors contributed to this boom by funding as many companies as they could, regardless of whether the companies were profitable or not.";
};


var slide_2 = function() {
  my_chart_object.select(["Deals"], [5]);
  document.getElementById("message").innerHTML = "In 2000, the height of the speculative bubble, the number of venture capital investment deals reached its peak.";
}


var slide_3 = function() {
	my_chart_object.regions.remove();
  my_chart_object.regions.add([
    {axis: "Year", start: 2009, end: 2015, class: "region1"}
  ]);
  my_chart_object.unselect();
  my_chart_object.select(["Deals"], [14]);  
  document.getElementById("message").innerHTML = "Immediately following the 2007-2008 financial crisis, the number of venture capital investment deals dipped but has slowly risen since 2009.";
}


var slide_4 = function() {
  my_chart_object.ygrids.add([{
  	value: 8041,
    text: "8041",
    position: "middle"   
  }, {
  	value: 4380,
    text: "4380",
    position: "middle"
  }]); 
  my_chart_object.unselect();
  my_chart_object.select(["Deals"], [5, 20]);
  my_chart_object.regions.remove();
  document.getElementById("message").innerHTML = "However, the number of deals in 2015 is only 54% of the number of deals in 2000. This implies that we are currently not experiencing the same level of irrational exuberence that was present in 2000.";
}


var slide_5 = function() {
  my_chart_object.ygrids.remove();
  my_chart_object.regions.remove();
  my_chart_object.regions([]);
	my_chart_object.load({
    columns: [
      ["Seed", 430, 502, 541, 672, 811, 707, 282, 182, 219, 233, 263, 401, 525, 534, 373, 405, 437, 305, 243, 207, 185],
      ["Early Stage", 521, 754, 900, 1032, 1739, 2857, 1303, 887, 810, 908, 876, 1014, 1153, 1179, 999, 1317, 1667, 1824, 2202, 2202, 2215],
      ["Expansion", 702, 1041, 1401, 1568, 2438, 3692, 2389, 1581, 1352, 1196, 1101, 1374, 1265, 1243, 892, 1068, 1025, 1006, 1033, 1162, 1145],
      ["Later Stage", 244, 338, 390, 472, 617, 786, 622, 567, 656, 899, 1062, 1108, 1291, 1251, 907, 885, 920, 856, 815, 870, 835]
    ],
  });
	my_chart_object.transform("bar", ["Seed", "Early Stage", "Expansion", "Later Stage"]);
	my_chart_object.groups([
    ["Seed", "Early Stage", "Expansion", "Later Stage"]
  ]);
  my_chart_object.unselect();
  document.getElementById("message").innerHTML = "Here is the breakdown of the number of venture capital deals by stage: seed, early stage, expansion, and later stage.";
}


var slide_6 = function() {
	my_chart_object.focus(["Expansion", "Early Stage"]);
	document.getElementById("message").innerHTML = "Irrespective of year, venture capitalists prefer to invest in the early and expansion stages of a company because that is when risk meets return.";
}


var slide_7 = function() {
	my_chart_object.revert();
  my_chart_object.load({
  	x: "Year",
    columns: [
    	["Year", 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
      ["Series A", 4.6, 5.5, 5.6, 6.1, 7.1, 5.4, 6.8, 8, 7.7, 9.3, 15.3, 16.3],
      ["Series B", 16.1, 18.6, 25.3, 22.8, 21.3, 15.7, 19.1, 24, 29.5, 29.5, 40, 58.5],
      ["Series C", 28.2, 30.6, 53.8, 46, 43.4, 28.2, 40, 49.5, 49, 70, 92.3, 70],
      ["Series D", 46.5, 41.9, 85, 73.8, 72.4, 51.1, 74.4, 94.2, 118.1, 107, 148, 286.5]
    ],
    unload: ["Deals", "Seed", "Early Stage", "Expansion", "Later Stage"],
  });
	my_chart_object.axis.labels({
  	y: "Millions ($)"
  })
  document.getElementById("message").innerHTML = "Here are the average pre-money valuations by Series of VC-funded companies from 2004-2015.";
}


var slide_8 = function() {
  my_chart_object.focus("Series D");
  document.getElementById("message").innerHTML = "The average pre-money valuations of Series A, B, and C companies have remained relatively steady from 2004-2015. In comparison, the average pre-money valuations of Series D companies have fluctuated more wildly.";
}


var slide_9 = function() {
  my_chart_object.regions([{
   start: 2013,
   end: 2015,
  }]);
   document.getElementById("message").innerHTML = "In particular, the average pre-money valuations of Series D companies have risen significantly since 2013. This increase is due to the influx of money from non-traditional VC investors, such as corporate VCs, hedge funds, mutual funds, and private equity investors.";
}


var slide_10 = function() {
  my_chart_object.regions([]);
  my_chart_object.revert();
  my_chart_object.load({
  	columns: [
            ["2010", 17700],
            ["2011", 24093],
            ["2012", 21527],
            ["2013", 984],
            ["2014", 46024]
        ],
    type : "pie",
    unload: ["Series A", "Series B", "Series C", "Series D"],
  });
  document.getElementById("message").innerHTML = "As valuations of companies have increased, total M&A deal size increased from $17700 million to $46024 million from 2010-2014.";
}


var slide_11 = function() {
	my_chart_object.focus("2014");
  document.getElementById("message").innerHTML = "As a matter of fact, the disclosed M&A value in 2014 accounts for 41.7% of total disclosed M&A value from 2010-2014.";
}


var slide_12 = function() {
  my_chart_object.load({
    columns: [
      ["Failed Startups", 92]
    ],
    type: "gauge",
    unload: ["2010", "2011", "2012", "2013", "2014"],
  })
  document.getElementById("message").innerHTML = "Despite the frothy venture capital environment which has seen a high number of deals, high valuations, and high M&A activity, 92% of startups fail within 3 years. To avoid another technology bubble burst, venture capitalists should conduct thorough due diligence before investing in a company and exercise caution.";
}


var slides = [slide_0, slide_1, slide_2, slide_3, slide_4, slide_5, slide_6, slide_7, slide_8, slide_9, slide_10, slide_11, slide_12];


var current_slide = 0;


var run = function() {
  slides[current_slide]();
  current_slide += 1;
  if (current_slide === 1) {
    document.getElementById("start_btn").innerHTML = "Start";
  } else if (current_slide === slides.length) {
    document.getElementById("start_btn").innerHTML = "End";
  } else {
    document.getElementById("start_btn").innerHTML = "Continue";
  }
};


document.getElementById('start_btn').addEventListener("click", run);


run();
