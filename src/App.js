import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery, gql } from '@apollo/client';

// Components
import Header from './components/Header'
import TempLineGraph from './components/TempLineGraph'
import LocationSelector from './components/LocationSelector'

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


const RANGES = gql`
    query GetRanges {
      result: ranges {
            minDate
            maxDate
            minTemp
            maxTemp
        }
    }
`;

function App() {

  // Set default ranges
  const defaultRanges = {
    years: [1989, 2019],
    dates: ['1989-01-01', '2019-12-01'],
    temps: [-20, 100]
  }

  const [city, setCity] = useState('london');
  const rangeData = useQuery(RANGES)
  const [ranges, setRanges] = useState(defaultRanges);

  useEffect(
    () => {
      // Set global ranges for all locations in dataset
      console.log("running range query!")
      if (!rangeData.loading && !rangeData.error) {
        let newRanges = {
          years: [
              new Date(rangeData.data.result.minDate).getFullYear(),
              new Date(rangeData.data.result.maxDate).getFullYear()
          ],
          dates: [rangeData.data.result.minDate, rangeData.data.result.maxDate],
          temps: [rangeData.data.result.minTemp, rangeData.data.result.maxTemp]
        }
        setRanges(newRanges)
      }
    }, [rangeData]
  )

  const wrapperSetCity = useCallback(val => {
    setCity(val);
  }, [setCity]);

  return (
    <div className="App">
      <Container>
        <Row>
          <Col md={6}>
            <Header />
          </Col>
          <Col md={6}>
            <LocationSelector city={city} updateParentCity={wrapperSetCity} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <TempLineGraph city={city} ranges={ranges}/>
          </Col>
        </Row>

      </Container>
    </div>
  );
}

export default App;
