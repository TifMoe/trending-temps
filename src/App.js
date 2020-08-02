import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Components
import Header from './components/Header'
import TempGraph from './components/TempGraph'
import LocationSelector from './components/LocationSelector'

// Data
import data from './data/locations.json';

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const client = new ApolloClient({
  uri: 'https://api.trendingtemps.com',
  cache: new InMemoryCache()
});

class App extends Component {

  constructor(){
    super()
    this.state = {
        selectedCity: 0,
        city: 'chicago',
        tempRange: [-50, 150],
        cities: [],
        allData: [{"values": []}],
        dateRange: ["Jan 1989", "Dec 2019"],
    }
  }

  async UNSAFE_componentWillMount() {
    await this.fetchData();
  }

  fetchData() {
    this.setDataInState(data.locations);
  }

  setDataInState(data) {
    let names = []
    let minTemp = 0
    let maxTemp = 100
    data.forEach(e => {
      names.push(e.city)
      minTemp = e.values.reduce((min, p) => p.mint < min ? p.mint : min, minTemp)
      maxTemp = e.values.reduce((max, p) => p.maxt > max ? p.maxt : max, maxTemp)
    });
    console.log(names)
    this.setState({
        allData: data,
        cities: names,
        tempRange: [minTemp, maxTemp]
    })
  }

  updateCitySelection = (cityIndex, cityName) => {
    console.log(cityIndex)
    this.setState({ selectedCity: cityIndex })
    this.setState({ city: cityName })
  }

  render() {
    return (
      <ApolloProvider client={client}>
      <div className="App">
        <Container>
          <Row>
            <Col md={6}>
              <Header />
            </Col>
            <Col md={6}>
              <LocationSelector updateCity={this.updateCitySelection} />
            </Col>
          </Row>

          <Row className="content">
            <Col md={12}>
              <TempGraph 
                data={this.state.allData} 
                city={this.state.selectedCity}
                dateRange={this.state.dateRange}
                tempRange={this.state.tempRange}/>
            </Col>
          </Row>

        </Container>
      </div>
      </ApolloProvider>
    );
  }
}

export default App;
