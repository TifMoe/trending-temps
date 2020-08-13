import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Dropdown } from "react-bootstrap";

const LOCATIONS = gql`
  query GetLocations {
    locations {
      name
      observations
      latitude
      longitude
      monthRange
      tempRange
    }
  }
`;

function LocationSelector({ city, updateParentCity }) {
  const [selectedCity, updateCity] = useState(city);
  const { loading, error, data } = useQuery(LOCATIONS);

  useEffect(() => {
    updateParentCity(selectedCity);
  }, [updateParentCity, selectedCity]);

  // Do not render dropdown if query not successfully completed
  if (loading) return <p>Loading cities...</p>;
  if (error) return <p>Error fetching cities :(</p>;

  return (
    <Dropdown style={{ marginTop: "50px" }}>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Select a City
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {unpackCityOptions(data.locations, updateCity)}
      </Dropdown.Menu>
    </Dropdown>
  );
}

function unpackCityOptions(locations, updateCity) {
  let cityOptions = [];
  for (let l of locations) {
    cityOptions.push(
      <Dropdown.Item
        onClick={() => updateCity(l.name.toLowerCase())}
        key={l.name}
      >
        {l.name}
      </Dropdown.Item>
    );
  }
  return cityOptions;
}

export default LocationSelector;
