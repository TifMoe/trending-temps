import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Dropdown } from 'react-bootstrap';

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

function LocationSelector({ updateCity }) {
    const { loading, error, data } = useQuery(LOCATIONS);

    if (loading) return <p>Loading cities...</p>;
    if (error) return <p>Error fetching cities :(</p>;
  
    return (
    <Dropdown style={{  marginTop: "50px"    }}>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          Select a City
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => updateCity(0, data.locations[0].name)}>{data.locations[0].name}</Dropdown.Item>
          <Dropdown.Item onClick={() => updateCity(1, data.locations[1].name)}>{data.locations[1].name}</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
    );
}

export default LocationSelector;