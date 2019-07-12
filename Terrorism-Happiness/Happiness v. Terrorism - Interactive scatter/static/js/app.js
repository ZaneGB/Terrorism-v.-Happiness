// Set up our chart
var svgWidth = 960;
var svgHeight = 600;
var margin = { top: 30, right: 40, bottom: 80, left: 175 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Import Data
// d3.csv("assets/data/data.csv"), function(err, healthData) {
//   if (err) throw err;
d3.csv("static/CSVs/happy_terror_pop.csv")
  .then(function(wellBeingData) {

//   console.log("Here line 19 of js");
//   console.log(wellBeingData);

  // Parse Data/Cast as numbers
   wellBeingData.forEach(function(data) {
    data.happiness = +data.happiness;
    data.actsToPop = +data.actsToPop;
    data.suicide = +data.suicide;
    data.alcohol = +data.alcohol;
    data.life = +data.life;
    data.gdp = +data.gdp;
    data.anxiety = +data.anxiety;
    data.drugs = +data.drugs;
  });

    // define scale functions(range)
    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);
  
    // define axis functions
    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);
  
    // these variables store the min and max values in a column in data.csv
    var xMin;
    var xMax;
    var yMin;
    var yMax;

//   // Initialize tooltip
//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function (d) {         
//         return (`${d.state}<br>Poverty: ${d.poverty}<br>Lacks Healthcare: ${d.healthcare}`);
//     });
    
//   // Create tooltip
//   chartGroup.call(toolTip);

  // Find Min and Max values in wellBeingData, setting aside some extra space to prettify graph
  
    function minimaxX(wellBeingDataX) {
        xMin = d3.min(wellBeingData, function (d) { return d[wellBeingDataX] * 0.9 });
        xMax = d3.max(wellBeingData, function (d) { return d[wellBeingDataX] * 1.1 });
    };

    function minimaxY(wellBeingDataY) {
        yMin = d3.min(wellBeingData, function (d) { return d[wellBeingDataY] * 0.9 });
        yMax = d3.max(wellBeingData, function (d) { return d[wellBeingDataY] * 1.1 });
    };

  // set the default x-axis
    var defaultX = "happiness";

  // set the default y-axis
    var defaultY = "life";

  // Find initial default values for axes
    minimaxX(defaultX);
    minimaxY(defaultY);

  // set the domains for the axes
    xScale.domain([xMin, xMax]);
    yScale.domain([yMin, yMax]);
  // Initialize tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {         
        return (`${d.country}<br>Happiness: ${d.happiness}<br>Life Expectancy: ${d.life}`);
    });
    
  // Create tooltip
  chartGroup.call(toolTip);
  // create chart
    chartGroup.selectAll("circle")
        .data(wellBeingData)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d[defaultX]);
        })
        .attr("cy", function (d) {
            return yScale(d[defaultY]);
        })
        .attr("r", 15)
        .attr("fill", "green")
        .attr("opacity", 0.15)
        // display tooltip on mouseover
        .on("mouseover", function (d) {
            toolTip.show(d);
        })
        // hide tooltip on mouseout
        .on("mouseout", function (d, i) {
            toolTip.hide(d);
        })

  // place country codes in circles
    chartGroup.selectAll("text")
        .data(wellBeingData)
        .enter()
        .append("text")
        .text(function (d) {
            return d.code;
        })
        .attr("x", function (d) {
            return xScale(d[defaultX]);
        })
        .attr("y", function (d) {
            return yScale(d[defaultY]);
        })
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("class","countryText");

      // display tooltip on mouseover
        // .on("mouseover", function (d) {
        //     toolTip.show(d);
        // })
      // hide tooltip on mouseout
        // .on("mouseout", function (d, i) {
        //     toolTip.hide(d);
        // })

  // create x-axis
    chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

  // create y-axis
    chartGroup.append("g")
        .attr("class", "y-axis")
        .call(yAxis)

  // Append axes titles

  // add main x-axis title
    // chart.append("text")
    //     .attr("transform", `translate(${width - 30},${height - 5})`)
    //     .attr("class", "axis-text")
    //     .text("Demographics")

    // chart.append("text")
    //     .attr("transform", `translate(15,60)rotate(270)`)
    //     .attr("class", "axis-text")
    //     .text("Health Risks")

  // add x-axis titles
    happinessLabel=chartGroup.append("text")
        .attr("transform", `translate(${width / 2},${height + 30})`)
        .attr("class", "text-x active")
        .attr("data-axis-name", "happiness")
        .text("Happiness Index");

//    lifeLabel=chartGroup.append("text")
//         .attr("transform", `translate(${width / 2},${height + 70})`)
//         .attr("class", "text-x inactive")
//         .attr("data-axis-name", "life")
//         .text("Life Expectancy");

//     gdpLabel=chartGroup.append("text")
//         .attr("transform", `translate(${width / 2},${height + 50})`)
//         .attr("class", "text-x inactive")
//         .attr("data-axis-name", "gdp")
//         .text("GDP per capita");

  // add y-axis titles 

    chartGroup.append("text")
        .attr("transform", `translate(-30,${height / 2})rotate(270)`)
        .attr("class", "text-y active")
        .attr("data-axis-name", "life")
        .text("Life Expectancy");

    chartGroup.append("text")
        .attr("transform", `translate(-50,${height / 2})rotate(270)`)
        .attr("class", "text-y inactive")
        .attr("data-axis-name", "gdp")
        .text("GDP per Capita");

    chartGroup.append("text")
        .attr("transform", `translate(-110,${height / 2})rotate(270)`)
        .attr("class", "text-y inactive")
        .attr("data-axis-name", "actsToPop")
        .text("Terrorist Act Rate");


    chartGroup.append("text")
        .attr("transform", `translate(-90,${height / 2})rotate(270)`)
        .attr("class", "text-y inactive")
        .attr("data-axis-name", "suicide")
        .text("Suicides per 100,000");


    chartGroup.append("text")
        .attr("transform", `translate(-70,${height / 2})rotate(270)`)
        .attr("class", "text-y inactive")
        .attr("data-axis-name", "alcohol")
        .text("Alcoholism Rate");

    chartGroup.append("text")
        .attr("transform", `translate(-150,${height / 2})rotate(270)`)
        .attr("class", "text-y inactive")
        .attr("data-axis-name", "anxiety")
        .text("Anxiety Rate");

    chartGroup.append("text")
        .attr("transform", `translate(-130,${height / 2})rotate(270)`)
        .attr("class", "text-y inactive")
        .attr("data-axis-name", "drugs")
        .text("Drug Abuse Rate");



  // Activate label when user clicks, deactivate others
    function labelChangeX(clickedAxis) {
        d3.selectAll(".text-x")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);

        clickedAxis.classed("inactive", false).classed("active", true);
    }

    function labelChangeY(clickedSelection) {
        d3.selectAll(".text-y")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);

        clickedSelection.classed("inactive", false).classed("active", true);
    }

  // on click events for the x-axis
    d3.selectAll(".text-x").on("click", function () {

      // assign the variable to the current axis
        var clickedSelection = d3.select(this);
        var isInactive = clickedSelection.classed("inactive");
        var clickedAxis = clickedSelection.attr("data-axis-name");

        if (isInactive) {
            newAxisX = clickedAxis;

            minimaxX(newAxisX);

            xScale.domain([xMin, xMax]);

            // create x-axis
            svg.select(".x-axis")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .call(xAxis);

            d3.selectAll("circle")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .on("start", function () {
                    d3.select(this)
                        .attr("opacity", 0.15)
                        .attr("r", 15)

                })
                .attr("cx", function (d) {
                    return xScale(d[newAxisX]);
                })
                .on("end", function () {
                    d3.select(this)
                        .transition()
                        .duration(1000)
                        .attr("r", 15)
                        .attr("fill", "green")
                        .attr("opacity", 0.15);
                })

            d3.selectAll(".countryText")
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .attr("x", function (d) {
                        return xScale(d[newAxisX]);
                    })            

            labelChangeX(clickedSelection);
        }
    });

  // On click events for the y-axis
    d3.selectAll(".text-y").on("click", function () {

      // assign the variable to the current axis
        var clickedSelection= d3.select(this);
        var isInactive = clickedSelection.classed("inactive");
        var clickedAxis = clickedSelection.attr("data-axis-name");
        console.log("current axis: ", clickedAxis);

        if (isInactive) {
            newAxisY = clickedAxis;

            minimaxY(newAxisY);

            yScale.domain([yMin, yMax]);

            // create y-axis
            svg.select(".y-axis")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .call(yAxis);

            d3.selectAll("circle")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .on("start", function () {
                    d3.select(this)
                        .attr("opacity", 0.15)
                        .attr("r", 15)

                })
                .attr("cy", function (data) {
                    console.log(data[newAxisY])
                    return yScale(data[newAxisY]);
                })
                .on("end", function () {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", 15)
                        .attr("fill", "green")
                        .attr("opacity", 0.15);
                })

            d3.selectAll(".countryText")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr("y", function (d) {
                    return yScale(d[newAxisY]);
                })

            labelChangeY(clickedSelection);
        }
    });
  });

 