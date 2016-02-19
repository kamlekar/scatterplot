  angular.module("myApp", [])

.controller("sctterController", ['$scope', function($scope){

	$scope.dataset = [
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
        { x: 64, y: 82.9, z: 31.3 }
	];

	$scope.config = {
		plot: {
			"type": "BubbleChart", //Options: ScatterChart/BubbleChart
			"r": 5,
			"fill": "red"
		},
		ticks: "10, 10",
		tickSize: "5, 5",
		regressionLine: {
			"enabled": false, //Options: true/false
			"x1": 20,
			"y1": 300,
			"x2": 100,
			"y2": 120,
			"stroke": "black",
			"stroke-width": 2
		},
		invert: false
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

			var parent = d3.select(element.parent()[0]),

				HEIGHT = parent[0][0].clientHeight,
				
				WIDTH = parent[0][0].clientWidth,

		    MARGINS = {
				  top: 20,
				  right: 20,
				  bottom: 50,
				  left: 50
			},

			minValue = getXY(config.minValue), maxValue = getXY(config.maxValue),

		    xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([minValue.x || d3.min(scope.data, function (d) {
		        return d[ALIAS.x];
		      }),
		      maxValue.x || d3.max(scope.data, function (d) {
		        return d[ALIAS.x];
		      })
		    ]),

		    yRange = d3.scale.linear().range([HEIGHT - MARGINS.bottom, MARGINS.top]).domain([minValue.y || d3.min(scope.data, function (d) {
		        return d[ALIAS.y];
		      }),
		      maxValue.y || d3.max(scope.data, function (d) {
		        return d[ALIAS.y];
		      })
		    ]);

			var ticks = config.ticks,

		    tickSize = config.tickSize, xTickSize = tickSize.x, yTickSize = tickSize.y,

		    tooltip = config.tooltip;

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
			var shape = config.plot, radius = 5, fill = "black",

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

			if(regressionLine.enabled) {
				svg.append("line")
					.attr(getD3CompatibleObj(regressionLine));
			};

			if(shape.fill) {
				fill = shape.fill;
			}

			svg.selectAll("circle")
				.data(scope.data)
				.enter()
				.append("circle")
				.attr("cx", function(d){return xRange(d[ALIAS.x]);})
				.attr("cy", function(d){return yRange(d[ALIAS.y]);})
				//.attr("r", radius)
				.style("fill", fill)
				.append("svg:title")
				.text(function(d){return (d[ALIAS.x]+" , "+d[ALIAS.y]);})

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