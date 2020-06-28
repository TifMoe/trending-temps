import React, { Component } from 'react'
import * as d3 from 'd3';
import './TempGraph.css'

var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

class TempGraph extends Component {

    constructor(){
        super()
        this.state = {
            displayCity: 0,
        }
    }

    componentDidMount() {
        this.setState({ displayCity: this.props.city })
        this.drawChart();
    }

    async componentDidUpdate() {
        if (this.state.displayCity !== this.props.city) {
            await this.setState({ displayCity: this.props.city })
            let chart = d3.select(this.refs.canvas).select("svg")
            console.log(chart)
            chart.remove()
            this.drawChart();
        }
    }

    formatData() {
        let dataSet = this.props.data[this.state.displayCity]
        if (!dataSet) {
            console.log("data from parent not available")
            return 
        }
       
        let data = dataSet.values
        data.forEach(d => {
            // Normalize dates
            d.date = d3.timeParse("%b %Y")(d.period);
            d.date = new Date(d.date); // x
            d.temp = +d.temp; // y

        })
        return data
    }

    addLine(chart, data, line, color) {
        chart.append('path')
            .attr('d', line(data))
            .attr('fill', 'none')
            .attr('stroke', color)
            .style('stroke-width', '1px');
    }

    addArea(chart, data, area, color) {
        chart.append('path')
            .attr('d', area(data))
            .attr('opacity', '30%')
            .attr('fill', color);
    }

    drawChart()  {
        let data = this.formatData()

        const svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 600 250")
            .classed("svg-content-responsive", true);

        // Make X Axis
        console.log(this.props.dateRange)
        console.log(width)
        let minDate = new Date(d3.timeParse("%b %Y")(this.props.dateRange[0]));
        let maxDate = new Date(d3.timeParse("%b %Y")(this.props.dateRange[1]));
        var xScale = d3.scaleTime()
            .domain([minDate, maxDate]).range([0, width]);
        var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%Y"))
        svgCanvas.append('g')
            .attr('transform', `translate(${margin.left}, ${height})`)
            .call(xAxis)

        // Make Y Axis
        var yMin = this.props.tempRange[0] - 10;
        var yMax = this.props.tempRange[1] + 10;
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

        var lineFreezing = d3.line()
            .x((d) => { return xScale(d.date); })
            .y(() => { return yScale(32); });
        this.addLine(chart, data, lineFreezing, 'grey')


        // Draw Lines
        var minArea = d3.area()
            .curve(d3.curveCatmullRom.alpha(0.5))
            .x(d => xScale(d.date))
            .y0(d => yScale(d.mint))
            .y1(d => yScale(d.temp))

            var maxArea = d3.area()
            .curve(d3.curveCatmullRom.alpha(0.5))
            .x(d => xScale(d.date))
            .y0(d => yScale(d.temp))
            .y1(d => yScale(d.maxt))

        var line = d3.line()
            .curve(d3.curveCatmullRom.alpha(0.5))
            .x((d) => { return xScale(d.date); })
            .y((d) => { return yScale(d.temp); });

        this.addLine(chart, data, line, 'grey')
        this.addArea(chart, data, minArea, 'blue')
        this.addArea(chart, data, maxArea, 'red')

    }

    render() {
        let minYear = this.props.dateRange[0].split(" ")[1]
        let maxYear = this.props.dateRange[1].split(" ")[1]
        let year = minYear === maxYear? minYear : `${minYear} - ${maxYear}`

        return (
            <div>
                <h3>{year}</h3>
                <p>Monthly Min and Max Temps </p>
                <div className="svg-container" ref="canvas"></div>
            </div>
        )
    }
}

export default TempGraph