import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";

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

export default function Home() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([] as string[]);
  const [continents, setContinents] = useState([] as string[]);

  useEffect(() => {
    if (data?.countries) {
      setCountries(data.countries);

      const allLanguages: string[] = [];
      const allContinents: string[] = [];

      data.countries.forEach((country: any) => {
        // Adding unique languages
        country.languages.forEach((language: any) => {
          if (!allLanguages.includes(language.name)) {
            allLanguages.push(language.name);
          }
        });

        // Adding unique continents
        if (
          country.continent?.name &&
          !allContinents.includes(country.continent.name)
        ) {
          allContinents.push(country.continent.name);
        }
      });

      setLanguages(allLanguages);
      setContinents(allContinents);
    }
  }, [data]);

  const handleSearchChange = (event: any) => {
    const searchValue = event?.target?.value;
    const filteredCountries = data?.countries?.filter((country: any) =>
      country?.name?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setCountries(filteredCountries);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <input type="text" onChange={handleSearchChange} />

      <h1>All Continents</h1>
      <ul>
        {continents.map((continent: string) => (
          <li key={continent}>{continent}</li>
        ))}
      </ul>

      <h1>All Languages</h1>
      <ul>
        {languages.map((language: string) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      {countries.map((country: any) => (
        <div key={country?.name}>
          <h2>{country?.name}</h2>
          <p>Capital: {country?.capital}</p>
          <p>Continent: {country?.continent.name}</p>
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
            {country?.languages?.map((language: any) => (
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
