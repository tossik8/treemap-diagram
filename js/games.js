const width = 960;
const height = 570;

const svg = d3.select(".panel")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

