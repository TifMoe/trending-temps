import { gql } from "@apollo/client";

export const WEATHER = gql`
    query GetWeather($location: String!) {
        weather(location: $location) {
            date
            month
            year
            temp
            minTemp
            maxTemp
            precip
        }
    }
`;

export const LOCATIONS = gql`
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

export const GLOBAL_RANGES = gql`
  query GetRanges {
    result: ranges {
      minDate
      maxDate
      minTemp
      maxTemp
    }
  }
`;