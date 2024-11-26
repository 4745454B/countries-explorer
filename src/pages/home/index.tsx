import classes from "./home.module.scss";
import { useEffect, useState, useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import CountryBox from "./components/countryBox";
import { TCountry, TLanguage, TFilters } from "../../types";
import { ESort } from "../../enums";
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
  const searchRef = useRef<HTMLInputElement>(null);

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
    filterSearch(searchValue);
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

  const handleClear = () => {
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    setFilters(INITIAL_FILTERS);
    filterSearch("");
  };

  /**
   * Functions
   */

  const filterSearch = (searchValue: string) => {
    const filteredCountries = data?.countries?.filter((country: TCountry) =>
      country?.name?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setCountries(filteredCountries);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  return (
    <div className={classes.container}>
      <div className={classes.filters}>
        <div className={classes.searchContainer}>
          <img src="/assets/images/icons/icon-search.svg" alt="search icon" />
          <input
            ref={searchRef}
            type="text"
            onChange={handleSearchChange}
            placeholder="Search by country name"
          />
        </div>

        <select
          className="select lg"
          value={filters.sort}
          onChange={handleSortChange}
        >
          {SORT.map((sort: any, index: number) => (
            <option key={`${sort}_${index}`} value={sort?.value}>
              Sort by {sort.label}
            </option>
          ))}
        </select>

        <select
          className="select lg"
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
          className="select lg"
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

        <button onClick={() => handleClear()} className="primary-btn lg">
          Clear
        </button>
      </div>

      <div className={classes.countriesContainer}>
        {countries.map((country: TCountry) => (
          <CountryBox key={country?.name} country={country} />
        ))}
      </div>
    </div>
  );
}
