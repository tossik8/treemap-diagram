import { firstColumn, secondColumn, thirdColumn } from "./data/legend-campaign-items.js";

const width = 960;
const height = 570;

const svg = d3.select("#tree-map-container")
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

    const groups = svg.selectAll("rect")
                      .data(root.leaves())
                      .enter()
                      .append("g")
                      .attr("class", "map-container");

    groups.append("rect")
          .attr("x", d => d.x0)
          .attr("y", d => d.y0)
          .attr("width", d => d.x1 - d.x0)
          .attr("class", "tile")
          .attr("height", d => d.y1 - d.y0)
          .attr("data-name", d => d.data.name)
          .attr("data-category", d => d.data.category)
          .attr("data-value", d => d.value)
          .attr("fill", d => determineColour(d.data.category));

    const divs = groups.append("foreignObject")
                       .attr("x", d => d.x0 + 4)
                       .attr("y", d => d.y0 + 4)
                       .attr("class", "text-div")
                       .attr("width", d => d.x1 - d.x0 - 4)
                       .attr("height", d => d.y1 - d.y0 - 4);

    divs.append("xhtml:div")
        .attr("class", "content")
        .html(d => d.data.name);

    const legend = d3.select(".panel")
                     .append("svg")
                     .attr("id", "legend")
                     .attr("width", 500)
                     .attr("height", 190);

    makeLegend(legend);
    makeTooltip(root.leaves());
}

function makeTooltip(data){
  const rects = document.getElementsByClassName("map-container");
  console.log(data);
  for(let i = 0; i < rects.length; ++i){
    rects[i].addEventListener("mouseover", (e) => {
      document.getElementById("name").textContent = "Name: " + data[i].data.name;
      document.getElementById("category").textContent = "Category: " + data[i].data.category;
      document.getElementById("value").textContent = "Value: " + data[i].value;

      document.getElementById("tooltip").setAttribute("data-value", data[i].value);

      document.getElementById("tooltip").style.top = rects[i].children[0].attributes.getNamedItem("y").value +  "px";
      document.getElementById("tooltip").style.left = rects[i].children[0].attributes.getNamedItem("x").value + "px";

      document.getElementById("tooltip").classList.remove("invisible");
      document.getElementById("tooltip").classList.add("visible");

    });
    rects[i].addEventListener("mouseleave", () => {
      document.getElementById("tooltip").classList.add("invisible");
      document.getElementById("tooltip").classList.remove("visible");
    });
  }
}
function makeLegend(legend){
  generateColumn(legend, firstColumn, 0, "first-column");
  generateColumn(legend, secondColumn, 80, "second-column");
  generateColumn(legend, thirdColumn, 150, "third-column");
}

function generateColumn(legend, column, x, id){
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
function determineColour(category){
  if(category === "Product Design") return "#4c92c3";
  else if(category === "Drinks") return "#45cbd9";
  else if(category === "Technology") return "#ffc993";
  else if(category === "Gaming Hardware") return "#de5253";
  else if(category === "Television") return "#d1c0dd";
  else if(category === "Food") return "#e992ce";
  else if (category === "Apparel") return "#d2d2d2";
  else if(category === "Tabletop Games") return "#bed2ed";
  else if(category === "Hardware") return "#56b356";
  else if(category === "Narrative Film") return "#ffadab"
  else if(category === "Web") return "#a3786f";
  else if(category === "Games") return "#f9c5db";
  else if(category === "Art") return "#c9ca4e";
  else if(category === "Video Games") return "#ff993e";
  else if(category === "Sound") return "#ade5a1";
  else if(category === "3D Printing") return "#a985ca";
  else if(category === "Wearables") return "#d0b0a9";
  else if(category === "Sculpture") return "#999999";
  else return "#e2e2a4";
}
