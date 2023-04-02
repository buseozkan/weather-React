import "../styles/App.css";
import React, { useEffect, useState } from "react";
import Weather from "./Weather";
import { Dimmer, Loader } from "semantic-ui-react";
import Forecast from "./forecast";
import Search from "./search";
import CurrentWeather from "./getWeather";
const GEO_API_URL = "https://api.opencagedata.com/geocode/v1/json";
const GEO_API_KEY = "cdd60320bf8e4cf2836d9f79cfb8eab8";

function App() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [data, setData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [localWeatherData, setLocalWeatherData] = useState(null);
  const [searchedWeatherData, setSearchedWeatherData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });

      await fetch(
        `${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
      )
        .then((res) => res.json())
        .then((result) => {
          setData(result);
        });
    };
    fetchData();
  }, [lat, long]);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.location.split(",");

    fetch(
      `${process.env.REACT_APP_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((currentWeatherResponse) => {
        setCurrentWeather({
          city: searchData.label,
          ...currentWeatherResponse,
        });
      })
      .catch(console.log);

    fetch(
      `${process.env.REACT_APP_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((forecastResponse) => {
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch(console.log);
  };

  const loadOptions = (inputValue) => {
    const options = [
      { value: "51.5074 -0.1278", label: "London, GB" },
      { value: "35.1203 33.9388", label: "Famagusta, CY" },
      { value: "35.6895 139.6917", label: "Tokyo, JP" },
      { value: "52.3667 4.8945", label: "Amsterdam, NL" },
      { value: "40.7128 -74.0060", label: "New York, US" },
    ];

    return fetch(
      `${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`,
      {
        headers: {
          "x-rapidapi-key": GEO_API_KEY,
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        return {
          options: [
            ...options,
            ...response.data.map((city) => {
              return {
                value: `${city.latitude} ${city.longitude}`,
                label: `${city.name}, ${city.countryCode}`,
              };
            }),
          ],
        };
      });
  };

  return (
    <div className="App">
      <Search onSearchChange={handleOnSearchChange} loadOptions={loadOptions} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}

      {typeof data.main != "undefined" ? (
        <Weather weatherData={data} />
      ) : (
        <div>
          <Dimmer active>
            <Loader>Loading..</Loader>
          </Dimmer>
        </div>
      )}
    </div>
  );
}

export default App;
