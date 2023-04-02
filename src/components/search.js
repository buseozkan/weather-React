import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";

const Search = ({ onSearchChange }) => {
  const [search, setSearch] = useState(null);

  const loadOptions = (inputValue) => {
    const cities = [
      { value: "51.5072 -0.1276", label: "London, United Kingdom" },
      { value: "35.1192 33.9381", label: "Famagusta, Cyprus" },
      { value: "35.6895 139.6917", label: "Tokyo, Japan" },
      { value: "52.3702 4.8952", label: "Amsterdam, Netherlands" },
      { value: "40.7128 -74.0060", label: "New York, United States" },
    ];

    const filteredCities = cities.filter((city) =>
      city.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return Promise.resolve({
      options: filteredCities,
    });
  };

  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={1000}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
