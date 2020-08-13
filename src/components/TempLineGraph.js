import React, { useRef, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

import * as d3 from 'd3';
import './TempGraph.css'

const WEATHER = gql`
    query GetWeather($location: String!) {
        weather(location: $location) {
            date
            month
            year
            temp
            minTemp
            maxTemp
        }
    }
`
const margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

function TempLineGraph( {city, ranges} ) {
    const d3Container = useRef(null);

    let result = useQuery(WEATHER, {
        variables: { "location": city },
    })

    // Format year range and cityname for title
    const minYear = ranges.years[0]
    const maxYear = ranges.years[1]
    const yearDisplay = minYear === maxYear ? minYear : `${minYear} - ${maxYear}`
    const cityDisplay = city[0].toUpperCase() + city.substr(1).toLowerCase()

    useEffect(
        () => {
            // This will remove any existing svg in the chart on prop update
            let chart = d3.select(d3Container.current)
            chart.selectAll("svg").remove()
        }, [city, ranges]
    )

    useEffect(
        () => {
            let data = {}
            if (result && !result.loading && !result.error) {
                data = JSON.parse(JSON.stringify(result.data.weather));
                data.forEach(d => {
                    d.date = new Date(d.date); // x
                    d.temp = +d.temp; // y
                    d.minTemp = +d.minTemp; // y
                    d.maxTemp = +d.maxTemp; // y
                })
            }

            // Find min and max date for X axis
            const minDate = new Date(ranges.dates[0]);
            const maxDate = new Date(ranges.dates[1]);

            // Find min and max temps for Y axis (with 10 degree buffer)
            const yMin = ranges.temps[0] - 10;
            const yMax = ranges.temps[1] + 10;

            const svgCanvas = d3.select(d3Container.current)
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 600 250")
                .classed("svg-content-responsive", true);

            // Make X Axis
            var xScale = d3.scaleTime()
                .domain([minDate, maxDate]).range([0, width]);
            var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%Y"))
            svgCanvas.append('g')
                .attr('transform', `translate(${margin.left}, ${height})`)
                .call(xAxis)

            // Make Y Axis
            var yScale = d3.scaleLinear()
                .domain([yMin, yMax]).range([height, 0]);
            var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(6);
            svgCanvas.append('g')
                .attr('transform', `translate(${margin.left}, 0)`)
                .call(yAxis)

            // Add line on chart to show freezing
            var chart = svgCanvas.append("g")
                .attr("transform", `translate(${margin.left}, 0)`);

            let lineFreezing = d3.line()
                .x((d) => { return xScale(d.date); })
                .y(() => { return yScale(32); });

            var lineData = lineFreezing(data)

            chart.append('path')
                .attr('d', lineData)
                .attr('fill', 'none')
                .attr('stroke', 'grey')
                .style('stroke-width', '1px');        

            // Draw Lines
            var minArea = d3.area()
                .curve(d3.curveCatmullRom.alpha(0.5))
                .x(d => xScale(d.date))
                .y0(d => yScale(d.minTemp))
                .y1(d => yScale(d.temp))

            var maxArea = d3.area()
                .curve(d3.curveCatmullRom.alpha(0.5))
                .x(d => xScale(d.date))
                .y0(d => yScale(d.temp))
                .y1(d => yScale(d.maxTemp))

            var line = d3.line()
                .curve(d3.curveCatmullRom.alpha(0.5))
                .x((d) => { return xScale(d.date); })
                .y((d) => { return yScale(d.temp); });

            chart.append('path')
                .attr('d', line(data))
                .attr('fill', 'none')
                .attr('stroke', 'grey')
                .style('stroke-width', '1px');

            chart.append('path')
                .attr('d', minArea(data))
                .attr('opacity', '30%')
                .attr('fill', 'blue');

            chart.append('path')
                .attr('d', maxArea(data))
                .attr('opacity', '30%')
                .attr('fill', 'red');
        }, [result, city, ranges]
    )

    return (
        <div>
            <h3>{cityDisplay}</h3>
            <p><b>{yearDisplay}</b> <br /> Monthly Min and Max Temps </p>
            <div className="svg-container" ref={d3Container}></div>
        </div>
    )
}

export default TempLineGraph

