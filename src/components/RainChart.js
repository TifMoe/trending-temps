import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { TimelineMax, Linear } from "gsap/all";
import * as _ from 'lodash';

import { WEATHER } from "../util/queries";
import { ReactComponent as BucketImg } from '../assets/rainbucket.svg';
import "./RainChart.css";

function RainChart({ city }) {
    const [annualInches, setInches] = useState();
    let result = useQuery(WEATHER, {
        variables: { location: city },
    });

    useEffect(() => {
        let data = [];
        let inches = 0

        if (result && !result.loading && !result.error) {
            let raw = JSON.parse(JSON.stringify(result.data.weather));

            let annual_sum = _(raw)
            .groupBy('year')
            .map((summary, year) => ({
                year: year,
                precip: _.sumBy(summary, 'precip'),
            }))
            .value()

            // Removes any years recording less than 1 inch of rain - assume bad data
            var annual_sum_with_data = _.map(annual_sum, function(o) {
                if (o.precip > 1) return o;
            });
            annual_sum_with_data = _.without(annual_sum_with_data, undefined)

            data[0] = _.meanBy(annual_sum_with_data, (year) => year.precip);
            inches = Math.round(data[0] * 10) / 10
        }

        let yScale = function(n) {
            return -(n * 3.5 + 10)
        }

        if (inches > 0) {
            setInches(inches)
            var tl = new TimelineMax()
            tl.to("#water", 1, {x: "+=0", y: `${yScale(inches)}`, ease: Linear.easeInOut});
        }
    }, [result, city]);

  return (
    <div>
        <h4>Average Annual Precipitation</h4>
        <h3><b>{annualInches}</b> inches</h3>
        <BucketImg />
    </div>
  );
}

export default RainChart;