const width = 960;
const height = 570;

const svg = d3.select(".panel")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json")
  .then(data => createTreemap(data,svg))

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
       .attr("height", d => d.y1 - d.y0);

}
