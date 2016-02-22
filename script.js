  angular.module("myApp", [])

.controller("sctterController", ['$scope', function($scope){
    $scope.dataset = [
    	{	
    		name: 'Female',
            color: 'rgba(223, 83, 83, .5)',
            data: [
		        { x: -10.3, y: 86.1, z: 11.8 },
		        { x: 78.4, y: 70.1, z: 16.6 },
		        { x: 74.2, y: 68.5, z: 14.5 },
		        { x: 95, y: 95, z: 13.8 },
		        { x: 86.5, y: 102.9, z: 14.7 },
		        { x: 80.8, y: 91.5, z: 15.8 },
		        { x: 80.4, y: 102.5, z: 12},
		        { x: 73.5, y: 83.1, z: 10 },
		        { x: 71, y: 93.2, z: 24.7 },
		        { x: 69.2, y: 57.6, z: 10.4 },
		        { x: 68.6, y: 20, z: 16 },
		        { x: 65.5, y: 126.4, z: 35.3 },
		        { x: 65.4, y: 50.8, z: 28.5 },
		        { x: 63.4, y: 51.8, z: 15.4 },
		        { x: 164, y: 82.9, z: 31.3 }],
		    regressionLine: {
				"enabled": false, //Options: true/false
				"x1": 20,
				"y1": 300,
				"x2": 100,
				"y2": 120,
				"stroke": "black",
				"stroke-width": 2
			}
	    },
	    {	
    		name: 'Male',
            color: 'rgba(3, 83, 83, .5)',
            data: [
		        { x: 95, y: 95, z: 13.8 },
		        { x: 86.5, y: 102.9, z: 14.7 },
		        { x: 80.8, y: 91.5, z: 15.8 },
		        { x: 80.4, y: 102.5, z: 12},
		        { x: 80.3, y: 86.1, z: 11.8 },
		        { x: 78.4, y: 70.1, z: 16.6 },
		        { x: 74.2, y: 68.5, z: 14.5 },
		        { x: 73.5, y: 83.1, z: 10 },
		        { x: 71, y: 93.2, z: 24.7 },
		        { x: 69.2, y: 57.6, z: 10.4 },
		        { x: 68.6, y: 20, z: 16 },
		        { x: 65.5, y: 126.4, z: 35.3 },
		        { x: 65.4, y: 50.8, z: 28.5 },
		        { x: 63.4, y: 51.8, z: 15.4 },
		        { x: 224, y: 82.9, z: 31.3 }],
		    regressionLine: {
				"enabled": false, //Options: true/false
				"x1": 20,
				"y1": 300,
				"x2": 100,
				"y2": 120,
				"stroke": "black",
				"stroke-width": 2
			}
	    }];


	$scope.config = {
		chart: {
			type: 'ScatterChart' , //Options: ScatterChart/BubbleChart
		},
		ticks: "10, 10",
		tickSize: "5, 5",

		invert: false,

	    title: {
	        text: 'Height Versus Weight of 507 Individuals by Gender'
	    },

	    subtitle: {
	        text: 'Source: Heinz  2003'
	    },
	    xAxis: {
	        title: {
	            enabled: true,
	            text: 'Height (cm)'
	        },
	        startOnTick: true,
	        endOnTick: true,
	        showLastLabel: true
	    },
	    yAxis: {
	        title: {
	            text: 'Weight (kg)'
	        }
	    },
	    legend: {
	        layout: 'vertical',
	        align: 'left',
	        verticalAlign: 'top',
	        x: 100,
	        y: 70,
	        floating: true,
	        backgroundColor: '#FFFFFF',
	        borderWidth: 1
	    },
	    plotOptions: {
	        scatter: {
	            marker: {
	                radius: 5,
	                states: {
	                    hover: {
	                        enabled: true,
	                        lineColor: 'rgb(100,100,100)'
	                    }
	                }
	            },
	            states: {
	                hover: {
	                    marker: {
	                        enabled: false
	                    }
	                }
	            },
	            tooltip: {
	                headerFormat: '<b>{series.name}</b><br>',
	                pointFormat: '{point.x} cm, {point.y} kg'
	            }
	        }
	    }
	}
}])

.directive("scatterchart", function(){
	return {
		restrict: 'E',
		scope: {
			data: '=',
			config: '='
		},
		link: function(scope, element, attrs) {
			var ALIAS = {
				x: "x",
				y: "y"
			}

			//Getting parent node and its properties
			var config = scope.config;

			if(config.invert === true) {
				var temp = ALIAS.x;
				ALIAS.x = ALIAS.y;
				ALIAS.y = temp;

				temp = config.regressionLine.x1;
				config.regressionLine.x1 = config.regressionLine.y1;
				config.regressionLine.y1 = temp;

				temp = config.regressionLine.x2;
				config.regressionLine.x2 = config.regressionLine.y2;
				config.regressionLine.y2 = temp;
			}

			var parent = d3.select(element.parent()[0]);

			var HEIGHT = parent[0][0].clientHeight;
				
			var WIDTH = parent[0][0].clientWidth;

		    var MARGINS = {
				  top: 20,
				  right: 20,
				  bottom: 50,
				  left: 50
			};

			var minValue = getXY(config.minValue), maxValue = getXY(config.maxValue);

			// Merging arrays to fetch the minimum and max values on scale
			var fullData = scope.data[0].data;
			for(var k = 1, iLen = scope.data.length; k < iLen; k ++){
				for(var j = 0, jLen = scope.data[k].data.length; j < jLen; j++) {
					var d = scope.data[k].data[j];
				 	fullData.push(d);
				}
			}



		    var xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([minValue.x || d3.min(fullData, function (d) {
		        return d[ALIAS.x];
		      }),
		      maxValue.x || d3.max(fullData, function (d) {
		        return d[ALIAS.x];
		      })
		    ]);

		    var yRange = d3.scale.linear().range([HEIGHT - MARGINS.bottom, MARGINS.top]).domain([minValue.y || d3.min(fullData, function (d) {
		        return d[ALIAS.y];
		      }),
		      maxValue.y || d3.max(fullData, function (d) {
		        return d[ALIAS.y];
		      })
		    ]);

			var ticks = config.ticks;

		    var tickSize = config.tickSize, xTickSize = tickSize.x, yTickSize = tickSize.y;

		    var tooltip = config.tooltip;

			var xAxis = d3.svg.axis()
		      .scale(xRange)
		      .ticks(getXY(config.ticks).x)
		      .tickSize(getXY(config.tickSize).x)
		      .tickSubdivide(true),

		    yAxis = d3.svg.axis()
		      .scale(yRange)
		      .ticks(getXY(config.ticks).y)
		      .tickSize(getXY(config.tickSize).y)
		      .orient("left")
		      .tickSubdivide(true);


			//Adding SVG Element to parent node and setting w,h properties same as parent
			d3.select(element[0])
				.append("svg")
				.attr("id", "svg")
				.attr("width", WIDTH)
				.attr("height", HEIGHT);

			var svg = d3.select("#svg");

			svg.append('svg:g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
				.call(xAxis);

			svg.append('svg:g')
				.attr('class', 'y axis')
				.attr('transform', 'translate(' + (MARGINS.left) + ',0)')
				.call(yAxis);

			//CHECKING for given attributes
			var shape = config.chart, radius = 5, fill = "black",

			regressionLine = config.regressionLine;

			function getD3CompatibleObj(oldObj){
				var newObj = {};
				for(var key in regressionLine){
					if(/x\d/.test(key)){
						newObj[key] = xRange(oldObj[key]);
					}
					else if(/y\d/.test(key)){
						newObj[key] = yRange(oldObj[key]);	
					}
					else{
						newObj[key] = oldObj[key];
					}
				}

				return newObj;
			}

			// if(regressionLine.enabled) {
			// 	svg.append("line")
			// 		.attr(getD3CompatibleObj(regressionLine));
			// };

			if(shape.fill) {
				fill = shape.fill;
			}

			for(var i=0, len=scope.data.length; i<len; i++) {
				var categoryData = scope.data[i];
				svg.selectAll("circle")
					.data(categoryData.data)
					.enter()
					.append("circle")
					.attr("cx", function(d){return xRange(d.x)})
					.attr("cy", function(d){return yRange(d.y);})
					//.attr("r", radius)
					.style("fill", categoryData.color || "black")
					.append("svg:title")
					.text(function(d){return (d[ALIAS.x]+" , "+d[ALIAS.y]);})
			}
				
				//.text('<div style="border:1px solid black">Hi</div>');//function(d){return (d[ALIAS.x] +", "+d[ALIAS.y]);}


			if(shape.type == "BubbleChart") {
				svg.selectAll("circle").attr("r", function(d){return d.z;});
			}
			if(shape.type == "ScatterChart") {
				svg.selectAll("circle").attr("r", radius);
			}

			function getXY(str) {
				if(str) {
					var index = str.split(","),
					x = index[0];
					return {
						'x': x.trim(),
						'y': (index[1] || x).trim()
					};
				}
				else {
					return {};
				}
			}
		}
	};
})