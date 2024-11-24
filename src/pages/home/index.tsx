/**
 * Imports
 */
import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

/**
 * Types
 */
import { TCountry, TLanguage, TFilters } from "../../types";

/**
 * Enums
 */
import { ESort } from "../../enums";

/**
 * Constants
 */
import { SORT } from "../../constants";

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      name
      capital
      continent {
        name
      }
      code
      languages {
        name
      }
      currency
      native
      phone
    }
  }
`;

const INITIAL_FILTERS = {
  continent: "" as string,
  language: "" as string,
  sort: ESort.NAME as ESort,
} as TFilters;

export default function Home() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [countries, setCountries] = useState([] as TCountry[]);
  const [languages, setLanguages] = useState([] as string[]);
  const [continents, setContinents] = useState([] as string[]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  useEffect(() => {
    if (data?.countries) {
      const sortedCountries = [...data?.countries].sort(
        (a: TCountry, b: TCountry) => a?.name?.localeCompare(b?.name)
      );
      setCountries(sortedCountries);

      const allLanguages: string[] = [];
      const allContinents: string[] = [];

      data?.countries?.forEach((country: TCountry) => {
        // Adding unique languages
        country?.languages?.forEach((language: TLanguage) => {
          if (!allLanguages.includes(language?.name)) {
            allLanguages.push(language?.name);
          }
        });

        // Adding unique continents
        if (
          country?.continent?.name &&
          !allContinents?.includes(country?.continent?.name)
        ) {
          allContinents?.push(country?.continent?.name);
        }
      });

      setLanguages(allLanguages);
      setContinents(allContinents);
    }
  }, [data]);

  useEffect(() => {
    if (countries.length === 0) return;
    if (!data?.countries) return;

    console.log("filters", filters);

    let sortedCountries = [...countries];

    switch (filters.sort) {
      case ESort.NAME:
        sortedCountries.sort((a: TCountry, b: TCountry) =>
          a.name.localeCompare(b.name)
        );
        break;
      case ESort.CONTINENT:
        sortedCountries.sort((a: TCountry, b: TCountry) =>
          a.continent?.name.localeCompare(b.continent?.name)
        );
        break;
    }

    setCountries(sortedCountries);
  }, [filters.sort]);

  useEffect(() => {
    if (!data?.countries) return;
    let filteredCountries = [...data?.countries];

    if (filters.language && filters.language !== "default") {
      filteredCountries = filteredCountries.filter((country: TCountry) =>
        country.languages.some(
          (lang: TLanguage) => lang.name === filters.language
        )
      );
    }

    if (filters.continent && filters.continent !== "default") {
      filteredCountries = filteredCountries.filter(
        (country: TCountry) => country.continent?.name === filters.continent
      );
    }

    setCountries(filteredCountries);
  }, [filters.continent, filters.language]);

  /**
   * Handlers
   */
  const handleSearchChange = (event: any) => {
    const searchValue = event?.target?.value;
    const filteredCountries = data?.countries?.filter((country: TCountry) =>
      country?.name?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setCountries(filteredCountries);
  };

  const handleSortChange = (event: any) => {
    const sortValue = event?.target?.value;
    setFilters({ ...filters, sort: sortValue });
  };

  const handleLanguageChange = (event: any) => {
    const languageValue = event?.target?.value;
    setFilters((prevFilters) => ({ ...prevFilters, language: languageValue }));
  };

  const handleContinentChange = (event: any) => {
    const continentValue = event?.target?.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      continent: continentValue,
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  return (
    <div>
      <input type="text" onChange={handleSearchChange} />

      <select value={filters.sort} onChange={handleSortChange}>
        {SORT.map((sort: any, index: number) => (
          <option key={`${sort}_${index}`} value={sort?.value}>
            {sort.label}
          </option>
        ))}
      </select>

      <select
        value={filters.continent || "default"}
        onChange={handleContinentChange}
      >
        <option value="default">Continent</option>
        {continents.map((continent: string) => (
          <option key={continent} value={continent}>
            {continent}
          </option>
        ))}
      </select>

      <select
        value={filters.language || "default"}
        onChange={handleLanguageChange}
      >
        <option value="default">Language</option>
        {languages.map((language: string) => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>

      <button onClick={() => setFilters(INITIAL_FILTERS)}>Clear</button>

      {countries.map((country: TCountry) => (
        <div key={country?.name}>
          <h2>{country?.name}</h2>
          <p>Capital: {country?.capital}</p>
          <p>Continent: {country?.continent?.name}</p>
          {country?.code && (
            <img
              src={`https://flagcdn.com/w320/${country?.code?.toLowerCase()}.png`}
              alt={`Flag of ${country?.name}`}
              style={{ width: "50px", height: "30px" }}
            />
          )}
          <h2>More Details</h2>
          <h3>Languages</h3>
          <ul>
            {country?.languages?.map((language: TLanguage) => (
              <li key={language?.name}>{language?.name}</li>
            ))}
          </ul>
          <p>Currency: {country?.currency}</p>
          <p>Native: {country?.native}</p>
          <p>Phone Code: +{country?.phone}</p>
        </div>
      ))}
    </div>
  );
}
