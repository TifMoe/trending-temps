import React, { Component } from 'react'
import * as d3 from 'd3';
import './TempGraph.css'

import chicago from '../data/chicago.json';
import london from '../data/london.json';

var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 950 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

class TempGraph extends Component {

    componentDidMount() {
        this.drawChart([london.location.values, chicago.location.values])
    }

    drawChart(dataSet)  {
        dataSet.forEach(data => {
            // For each dataset, normalize dates
            data.forEach(d => {
                d.date = d3.timeParse("%b %Y")(d.period);
                d.date = new Date(d.date); // x
                d.temp = +d.temp; // y
            })
        })
        var london = dataSet[0]
        var chicago = dataSet[1]

        const svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        var allData = dataSet[0].concat(dataSet[1])
        console.log(allData)

        // Make X Axis
        var xExtent = d3.extent(allData, d => d.date);
        var xScale = d3.scaleTime()
            .domain(xExtent).range([0, width]);
        var xAxis = d3.axisBottom().scale(xScale)
        
        svgCanvas.append('g')
            .attr('transform', `translate(${margin.left}, ${height})`)
            .call(xAxis)

        // Make Y Axis
        var yMin = d3.min(allData, d => d.mint)
        var yMax = d3.max(allData, d => d.maxt);
        
        var yScale = d3.scaleLinear()
            .domain([yMin, yMax]).range([height, 0]);
        var yAxis = d3.axisLeft()
            .scale(yScale);
    
        svgCanvas.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis)

        // Draw Lines
        var chart = svgCanvas.append("g")
            .attr("transform", `translate(${margin.left}, 0)`);

        var area = d3.area()
            .curve(d3.curveCatmullRom.alpha(0.5))
            .x(d => xScale(d.date))
            .y0(d => yScale(d.mint))
            .y1(d => yScale(d.maxt))

        var line = d3.line()
            .x((d) => { return xScale(d.date); })
            .y((d) => { return yScale(d.temp); });

        chart.append('path')
            .attr('d', area(chicago))
            .attr('class', 'chicago');

        chart.append('path')
            .attr('d', area(london))
            .attr('class', "london");
    }

    render() {
        return (
            <div>
                <div ref="canvas"></div>
            </div>
        )
    }
}

export default TempGraph