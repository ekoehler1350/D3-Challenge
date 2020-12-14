//Set up the chart
var svgWidth = 960
var svgHeight = 500

var margin = {
	top: 20 
	right: 40
	bottom: 60
	left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
	.select("body")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);


// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

//Load data from .csv 
d3.csv("data.csv", function(err, healthData){
	if (err) throw err;
console.log(healthData)
	// parse data and cast values as numbers
	healthData.forEach(function(data){
		data.healthcare = +healthcare;
		data.poverty = +data.poverty;
	});

	//Create the scale functions
	var xLinearScale = d3.selectLinear().range([0, width]);
	var ylinearScale = d3.scaleLinear().range([height, 0]);

	//Create axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(ylinearScale);

	var xMin;
	var xMax;
	var yMin;
	var yMax;

	xMin = d3.min(healthData, function(data){
		return data.healthcare;
	});

	xMax = d3.max(healthData, function(data){
		return data.healthcare;
	});

	yMin = d3.min(healthData, function(data){
		return data.poverty;
	});

	yMax = d3.max(healthData, function(data){
		return data.poverty;
	});

	xLinearScale.domain([xMin, xMax]);
	ylinearScale.domain([yMin, yMax]);
	console.log(xMin);
	console.log(yMax);

	//Append x axis to chart
	var xAxis = chartGroup.append("g")
		.classed("x-axis", true)
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	//Append y axis to chart 
	chartGroup.append("g")
		.call(leftAxis);

	//Append Initial circles 
	var circlesGroup = chartGroup.selectAll("circle")
		.data(healthData)
		.enter()
		.append("circle")
		.attr("cx", d => xLinearScale(d.healthcare))
		.attr("cy", d => ylinearScale(d.poverty))
		.attr("r", "15")
		.attr("fill", "blue")
		.attr("opacity", ".5")
		.on("mouseout", function(data, index){
			toolTip.hid(data);
		});

		//Initialize toolTip in chart
		var toolTip = d3.tip()
			.attr("class", "tooltip")
			.offset([80, -60])
			.html(function(d){
				return (abbr + '%');
			});

		chartGroup.call(toolTip);

		//Create "mouseover" event listeners to display tooltip
		circlesGroup.on("mouseover", function(healthData){
			toolTip.show(healthData);
		})
		//hide tooltip "mouseout" event listener
			.on("mouseout", function(data, index){
				toolTip.hide(data);
			});

	//Create axis labels
	chartGroup.append("text")
	.style("font-size", "12px")
	.selectAll("tspan")
	.data(healthData)
	.enter()
	.append("tspan")
		.attr("x", function(data){
			return xLinearScale(data.healthcare +1.4);
		})
		.attr("y", function(data){
			return ylinearScale(data.poverty +.1);
		})
		.text(function(data){
			return data .abbr
		});

	chartGroup.append("text")
		.attr("transform", "rotate(-90")
		.attr("y", 0 - margin.left + 40)
		.attr("x", 0 - (height/2))
		.attr("dy", "1em")
		.attr("class", "axisText")
		.text("Lacks Healthcare (%)");

	chartGroup.append("g")
		.attr("transform", `translate(${width/2}, ${height + margin.top +40})`)
		.attr("class", "axisText")
		.text("In Poverty (%)");

});