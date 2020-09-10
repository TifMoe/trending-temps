import React, { useRef, useEffect } from "react";
import { useQuery } from "@apollo/client";

import * as d3 from "d3";
import "./TempGraph.css";
import { WEATHER } from "../util/queries";


const margin = { top: 20, right: 20, bottom: 50, left: 70 },
  width = 600 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

function TempLineGraph({ city, ranges }) {
  const d3Container = useRef(null);
  // Find min and max date for X axis
  const minDate = new Date(ranges.dates[0]);
  const maxDate = new Date(ranges.dates[1]);

  // Find min and max temps for Y axis (with 10 degree buffer)
  const yMin = ranges.temps[0] - 10;
  const yMax = ranges.temps[1] + 10;

  let result = useQuery(WEATHER, {
    variables: { location: city },
  });

  // Format year range and cityname for title
  const minYear = ranges.years[0];
  const maxYear = ranges.years[1];
  const yearDisplay = minYear === maxYear ? minYear : `${minYear} - ${maxYear}`;

  useEffect(() => {
    // This will remove any existing svg in the chart on range update
    let chart = d3.select(d3Container.current);
    chart.selectAll("svg").remove();
  }, [ranges]);

  useEffect(() => {
    let data = {};
    
    if (!result || result.loading || result.error) {
      console.log('resturning!')
      return 
    }

    data = JSON.parse(JSON.stringify(result.data.weather));
    data.forEach((d) => {
      d.date = new Date(d.date); // x
      d.temp = +d.temp; // y
      d.minTemp = +d.minTemp; // y
      d.maxTemp = +d.maxTemp; // y
    });

    const svgCanvas = d3
      .select(d3Container.current)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 600 250")
      .classed("svg-content-responsive", true);

    // Make X Axis
    var xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, width]);
    var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%Y"));
    svgCanvas
      .append("g")
      .attr("transform", `translate(${margin.left}, ${height})`)
      .call(xAxis);

    // Make Y Axis
    var yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);
    var yAxis = d3.axisLeft().scale(yScale).ticks(6);
    svgCanvas
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Add line on chart to show freezing
    var chart = svgCanvas
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`);

    let lineFreezing = d3
      .line()
      .x((d) => {
        return xScale(d.date);
      })
      .y(() => {
        return yScale(32);
      });

    var lineData = lineFreezing(data);
    chart.append("path")
      .attr("d", lineData)
      .attr("fill", "none")
      .attr("stroke", "grey")
      .style("stroke-width", "1px");

    // Draw Lines
    var minArea = d3
      .area()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => xScale(d.date))
      .y0((d) => yScale(d.minTemp))
      .y1((d) => yScale(d.temp));

    var maxArea = d3
      .area()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => xScale(d.date))
      .y0((d) => yScale(d.temp))
      .y1((d) => yScale(d.maxTemp));

    var line = d3
      .line()
      .curve(d3.curveCatmullRom.alpha(0.5))
      .x((d) => {
        return xScale(d.date);
      })
      .y((d) => {
        return yScale(d.temp);
      });

     // First define all the lines and areas
    chart.datum(data)
      .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "var(--yellow)")
        .style("stroke-width", "1px")

    chart
      .append("path")
        .attr("class", "minArea")
        .attr("opacity", "40%")
        .attr("fill", "var(--font)");

    chart
      .append("path")
        .attr("class", "maxArea")
        .attr("opacity", "40%")
        .attr("fill", "var(--font)");

    // Transition Time
    var t = d3.transition()
        .duration(1750)
        .ease(d3.easeLinear);
    
    // Update the paths between city transitions
    d3.select(".line")
        .transition(t)
        .attr("d", line(data))

    d3.select(".minArea")
      .transition(t)
      .attr("d", minArea(data))

    d3.select(".maxArea")
      .transition(t)
      .attr("d", maxArea(data))

  }, [result, city, ranges, maxDate, minDate, yMax, yMin]);

  return (
    <div>
      <h4>Monthly Min and Max Temps</h4>
      <h3>{yearDisplay}</h3>
      <div className="svg-container" ref={d3Container}></div>
    </div>
  );
}

export default TempLineGraph;
