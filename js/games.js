import { firstColumn, secondColumn, thirdColumn } from "./data/legend-games-items.js";

function adjustZoom(){
  if(document.documentElement.clientWidth < 380){
    document.body.style.zoom = "37%";
  }
  else if(document.documentElement.clientWidth < 520){
    document.body.style.zoom = "40%";
  }
  else if(document.documentElement.clientWidth < 700){
    document.body.style.zoom = "50%";
  }
  else if(document.documentElement.clientWidth < 880){
    document.body.style.zoom = "70%";
  }
  else if(document.documentElement.clientWidth < 980){
    document.body.style.zoom = "90%";
  }
  else{
    document.body.style.zoom = "100%";
  }
}
window.onload = () => {
  adjustZoom();
}
window.onresize = () => {
  adjustZoom();
}

const width = 960;
const height = 570;

const svg = d3.select("#tree-map-container")
    .append("svg")
    .attr("id", "tree-map")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
  .then(data => createTreemap(data, svg));

function createTreemap(data, svg){
    const hierarchy = d3.hierarchy(data)
                        .sum(d => d.value)
                        .sort((a,b) => b.value - a.value);

    const treemap = d3.treemap()
                      .size([width, height])
                      .padding(0.5);

    const root = treemap(hierarchy);

    const groups = svg.selectAll("rect")
                      .data(root.leaves())
                      .enter()
                      .append("g")
                      .attr("class", "map-container");

     groups.append("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("class", "tile")
            .attr("width", d => d.x1 - d.x0)
            .transition()
            .duration(1000)
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
                     .attr("width", 500);

    makeLegend(legend);
    makeTooltip(root.leaves());
}
function makeLegend(legend){
  generateColumn(legend, firstColumn, 40, "first-column");
  generateColumn(legend, secondColumn, 120, "second-column");
  generateColumn(legend, thirdColumn, 190, "third-column");
}

function makeTooltip(data){
  const rects = document.getElementsByClassName("map-container");
  for(let i = 0; i < rects.length; ++i){
    rects[i].addEventListener("mouseover", () => {
      document.getElementById("name").textContent = "Name: " + data[i].data.name;
      document.getElementById("category").textContent = "Category: " + data[i].data.category;
      document.getElementById("value").textContent = "Value: " + data[i].value;

      document.getElementById("tooltip").setAttribute("data-value", data[i].value);

      document.getElementById("tooltip").style.top = rects[i].children[0].attributes.getNamedItem("y").value +  "px";
      document.getElementById("tooltip").style.left = parseFloat(rects[i].children[0].attributes.getNamedItem("x").value) + parseFloat(rects[i].children[0].attributes.getNamedItem("width").value) + "px";

      document.getElementById("tooltip").classList.remove("invisible");
      document.getElementById("tooltip").classList.add("visible");

    });
    rects[i].addEventListener("mouseleave", () => {
      document.getElementById("tooltip").classList.add("invisible");
      document.getElementById("tooltip").classList.remove("visible");
    });
  }
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
  if(category === "Wii") return "#4c92c3";
  else if(category === "GB") return "#ffc993";
  else if(category === "PS2") return "#de5253";
  else if(category === "SNES") return "#d1c0dd";
  else if(category === "GBA") return "#e992ce";
  else if (category === "2006") return "#d2d2d2";
  else if(category === "DS") return "#bed2ed";
  else if(category === "PS3") return "#56b356";
  else if(category === "3DS") return "#ffadab"
  else if(category === "PS") return "#a3786f";
  else if(category === "XB") return "#f9c5db";
  else if(category === "PSP") return "#c9ca4e";
  else if(category === "X360") return "#ff993e";
  else if(category === "NES") return "#ade5a1";
  else if(category === "PS4") return "#a985ca";
  else if(category === "N64") return "#d0b0a9";
  else if(category === "PC") return "#999999";
  else return "#e2e2a4";
}
