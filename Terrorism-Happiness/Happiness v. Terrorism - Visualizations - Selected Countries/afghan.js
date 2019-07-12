// d3.csv("new_happiness_factor.csv", function(d) {
//     console.log(d)
//     d.forEach(function(data) {
//       // data.date = parseTime(data.date);
//       data.dystopia = +data.dystopia;
//     });
//     console.log(d);


var data = [0.56, 0.11, 0.16, 0.11, 0, 0.05, 0.01];

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal()
    .range(["#A52A2A", "#0000FF", "#FFFF00", "#FFD700", "#008000", "#FF0000"]);

var arc = d3.arc()
    .outerRadius(radius - 30)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 60)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data; });