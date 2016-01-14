  angular.module("myApp", [])

.controller("sctterController", ['$scope', function($scope){

	$scope.dataset = [
		{"month": 10, "sales": 100, "color": "red"},
		{"month": 20, "sales": 130, "color": "blue"},
		{"month": 30, "sales": 250, "color": "red"},
		{"month": 40, "sales": 300, "color": "blue"},
		{"month": 50, "sales": 265, "color": "red"},
		{"month": -20, "sales": 225, "color": "blue"},
		{"month": 70, "sales": 180, "color": "red"},
		{"month": 80, "sales": 120, "color": "blue"},
		{"month": 90, "sales": 145, "color": "red"},
		{"month": 100, "sales": 130, "color": "blue"}];

	$scope.config = {
		plot: {
			"r": "5",
			"fill": "red"
		},
		ticks: "10, 10",
		tickSize: "5, 5",
		regressionLine: {
			"enabled": true,
			"x1": 20,
			"y1": 300,
			"x2": 100,
			"y2": 120,
			"stroke": "black",
			"stroke-width": 2
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
				x: "month",
				y: "sales"
			}

			//Getting parent node and its properties
			var parent = d3.select(element.parent()[0]),

				HEIGHT = parent[0][0].clientHeight,
				
				WIDTH = parent[0][0].clientWidth,

		    MARGINS = {
				  top: 20,
				  right: 20,
				  bottom: 50,
				  left: 50
			};
		    
		    var config = scope.config, minValue = getXY(config.minValue), maxValue = getXY(config.maxValue),

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

			
			if(shape.r) {
				radius = shape.r;
			}
			if(shape.fill) {
				fill = shape.fill;
			}

			svg.selectAll("circle")
				.data(scope.data)
				.enter()
				.append("circle")
				.attr("cx", function(d){return xRange(d[ALIAS.x]);})
				.attr("cy", function(d){return yRange(d[ALIAS.y]);})
				.attr("r", radius)
				.style("fill", function(d){return (d.color);})
				.append("svg:title")
				.text(function(d){return (d[ALIAS.x]+" , "+d[ALIAS.y]);})

				//.text('<div style="border:1px solid black">Hi</div>');//function(d){return (d[ALIAS.x] +", "+d[ALIAS.y]);}

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


