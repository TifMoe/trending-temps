import * as d3 from "d3";

export function PathLength(path) {
    return d3.create("svg:path").attr("d", path).node().getTotalLength();
}
