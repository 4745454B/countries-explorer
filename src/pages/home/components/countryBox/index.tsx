import classes from "./countryBox.module.scss";
import { TCountry, TLanguage } from "../../../../types";
import countryInfo from "../../../../data/countryInfo.json";
import { useState } from "react";

export default function CountryBox({ country }: { country: TCountry }) {
  const [showMore, setShowMore] = useState(false);

  const getWeatherData = async (country: TCountry) => {
    const countryData = countryInfo[country.code as keyof typeof countryInfo];

    if (!countryData) {
      console.error("Country not found in countryInfo");
      return;
    }

    const { latitude, longitude } = countryData;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
          import.meta.env.VITE_OPEN_WEATHER_API_KEY as string
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      console.log("Weather Data", data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const onViewMore = (country: TCountry) => {
    setShowMore(!showMore);
    if (showMore) return;
    getWeatherData(country);
  };

  return (
    <div className={classes.countryBox}>
      <h2>{country?.name}</h2>
      <p>Capital: {country?.capital}</p>
      <p>Continent: {country?.continent?.name}</p>
      {country?.code && (
        <img
          src={`https://flagcdn.com/w320/${country?.code?.toLowerCase()}.png`}
          alt={`Flag of ${country?.name}`}
          style={{ width: "50px", height: "30px" }}
          className={classes.flag}
        />
      )}
      <button onClick={() => onViewMore(country)}>
        {showMore ? "Show Less" : "Show More"}
      </button>
      <div className={`${classes.moreDetails} ${showMore ? classes.show : ""}`}>
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
    </div>
  );
}
