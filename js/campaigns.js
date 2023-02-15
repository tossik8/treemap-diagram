import { firstColumn, secondColumn, thirdColumn } from "./data/legend-campaign-items.js";

const width = 960;
const height = 570;

const svg = d3.select(".panel")
    .append("svg")
    .attr("id", "tree-map")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json")
  .then(data => createTreemap(data,svg));

function createTreemap(data,svg){
    const hierarchy = d3.hierarchy(data)
                        .sum(d => d.value)
                        .sort((a,b) => b.value - a.value);

    const treemap = d3.treemap()
                      .size([width, height])
                      .padding(0.5);

    const root = treemap(hierarchy);

    console.log(hierarchy);

    svg.selectAll("rect")
       .data(root.leaves())
       .enter()
       .append("rect")
       .attr("x", d => d.x0)
       .attr("y", d => d.y0)
       .attr("width", d => d.x1 - d.x0)
       .attr("height", d => d.y1 - d.y0)
       .attr("data-name", d => d.data.name)
       .attr("data-category", d => d.data.category)
       .attr("data-value", d => d.value);

    const legend = d3.select(".panel")
                     .append("svg")
                     .attr("id", "legend")
                     .attr("width", 500);

    makeLegend(legend);
}
function makeLegend(legend){
  generateColumn(legend, firstColumn, 0, "first-column");
  generateColumn(legend, secondColumn, 80, "second-column");
  generateColumn(legend, thirdColumn, 150, "third-column");
}

function generateColumn(legend, column, x, id){
  console.log(column);
  const groups = legend.selectAll(id)
                        .attr("id", id)
                        .data(column)
                        .enter()
                        .append("g")
                        .attr("transform", (d, i) => `translate(${x}, ${i * 10})`);

  groups.append("rect")
        .attr("class", "legend-item")
        .attr("width",15)
        .attr("height", 15)
        .attr("x", x)
        .attr("y", (d, i) => 0 + i * 15)
        .attr("fill", d => d.colour);

  groups.append("text")
        .text(d => d.text)
        .attr("x", x + 20)
        .attr("y", (d,i) => 13 + i * 15);
}
