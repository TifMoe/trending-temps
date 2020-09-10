import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import * as d3 from "d3";

import { LOCATIONS } from "../util/queries";
import "./Map.css";

function WorldMap({ city, updateParentCity }) {  
    const d3Container = useRef(null);
    const [selectedCity, updateCity] = useState(city);
    const result = useQuery(LOCATIONS);
    
    // Update selected city in parent
    useEffect(() => {
        updateParentCity(selectedCity);
      }, [updateParentCity, selectedCity]);

    // Render map on data or city update
    useEffect(() => {
        let data = [];
        if (result && !result.loading && !result.error) {
          let raw = JSON.parse(JSON.stringify(result.data.locations));
          raw.forEach((d) => {
            data.push({
                name: d.name,
                lat: +d.latitude,
                lon: +d.longitude,
            })
          });
        }

        var width = 1000, height = 500;
        const svg = d3
            .select(d3Container.current)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .classed("map-content-responsive", true);
            
        var projection = d3.geoMercator()
            .scale(width / 1.75 / Math.PI)
            .translate([width / 1.75, height / 1.75])
            .rotate([-30,0]);

        d3.select("body")
            .append("div")
            .attr("id", "mytooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("color", "var(--font)")
            .style("background-color", "var(--chart-background)")
            .style("padding", "3px 5px")
            .style("border-radius", "3px")
            .text("a simple tooltip");

        // Load external data and boot
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
            .then(function(m){
                // Draw the map
                svg.append("g")
                    .selectAll("path")
                    .data(m.features)
                    .enter().append("path")
                        .attr("fill", "#5bb3b3cb")
                        .attr("d", d3.geoPath()
                            .projection(projection)
                        )
                        .style("stroke", "var(--background)")
                        .style("stroke-width", 1)

                var circle = svg.selectAll('circle')
                    .data(data)

                circle.enter()
                    .append("circle")
                        .attr("cx", function(d) { var l = projection([d.lon, d.lat]); return l[0]; })
                        .attr("cy", function(d) { var l = projection([d.lon, d.lat]); return l[1]; })
                        .attr("r", function(d) {
                            if (d.name.toLowerCase() === city) {
                                return 15
                            }
                            return 10
                        })
                        .attr("fill", function(d) {
                            if (d.name.toLowerCase() === city) {
                                return "var(--yellow)"
                            }
                            return "transparent"
                        })
                        .attr("stroke", "white")
                        .attr("stroke-width", 4)
                    .on("mouseover",function(d) { 
                        //show tooltip on hover
                        d3.select("#mytooltip")
                            .style("visibility", "visible")
                            .text(d.name.toUpperCase())
                        d3.select(this).style("stroke-width", 6)
                        })
                    .on("mousemove", function() {
                        d3.select("#mytooltip")
                            .style("top", (d3.event.pageY-40)+"px") 
                            .style("left",(d3.event.pageX)+"px")
                        })
                    .on("mouseout",function() { 
                        //hide tooltip on mouseout
                        d3.select("#mytooltip")
                            .style("visibility", "hidden")
                            .style("fill", "transparent")
                        d3.select(this).style("stroke-width", 4)
                        })
                    .on("click", function(d) {
                        updateCity(d.name.toLowerCase());
                    })
                })
        }, [result, city])

    return (
        <div className="svg-container" ref={d3Container}></div>
    )
}

export default WorldMap