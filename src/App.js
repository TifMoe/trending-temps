import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GLOBAL_RANGES } from "./util/queries";

// Components
import Header from "./components/Header";
import TempLineGraph from "./components/TempLineGraph";
import LocationSelector from "./components/LocationSelector";
import RainChart from "./components/RainChart";
import WorldMap from "./components/Map";

// Style
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


function App() {
  // Set default ranges
  const defaultRanges = {
    years: [1989, 2019],
    dates: ["1989-01-01", "2019-12-01"],
    temps: [-20, 100],
  };

  const [city, setCity] = useState("london");
  const rangeData = useQuery(GLOBAL_RANGES);
  const [ranges, setRanges] = useState(defaultRanges);

  useEffect(() => {
    // Set global ranges for all locations in dataset
    if (!rangeData.loading && !rangeData.error) {
      let newRanges = {
        years: [
          new Date(rangeData.data.result.minDate).getFullYear(),
          new Date(rangeData.data.result.maxDate).getFullYear(),
        ],
        dates: [rangeData.data.result.minDate, rangeData.data.result.maxDate],
        temps: [rangeData.data.result.minTemp, rangeData.data.result.maxTemp],
      };
      setRanges(newRanges);
    }
  }, [rangeData]);

  const wrapperSetCity = useCallback(
    (val) => {
      setCity(val);
    },
    [setCity]
  );

  return (
    <div className="wrapper">
      <div className="box logo">
        <Header />
      </div>
      <div className="box city">
        <LocationSelector city={city} updateParentCity={wrapperSetCity} />
      </div>
      <div className="box map">
        <WorldMap city={city} updateParentCity={wrapperSetCity} />
      </div>
      <div className="box temp">
        <TempLineGraph city={city} ranges={ranges} />
      </div>
      <div className="box percip">
        <RainChart city={city} />
      </div>
      <div className="box brush">
        Brush to filter on year coming soon
      </div>
      <div className="box description">
        Personal dashboard to practice D3.js by exploring historical weather trends. <br />
        Select a city from the map or dropdown to view temperature and percipitation data
      </div>
    </div>
  );
}

export default App;
