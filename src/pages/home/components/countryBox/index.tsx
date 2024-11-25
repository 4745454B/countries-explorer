import classes from "./countryBox.module.scss";
import { TCountry, TLanguage, TWeather } from "../../../../types";
import countryInfo from "../../../../data/countryInfo.json";
import { useState } from "react";

export default function CountryBox({ country }: { country: TCountry }) {
  const [showMore, setShowMore] = useState(false);
  const [weatherData, setWeatherData] = useState({} as TWeather);

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
      setWeatherData({
        temp: data?.main?.temp,
        icon: data?.weather[0]?.icon,
        description: data?.weather[0]?.description,
      });
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

  const convertKelvinToCelsius = (kelvin: number) => {
    if (kelvin < 0) return Math.round(0);
    return Math.round(kelvin - 273.15);
  };

  return (
    <div className={classes.countryBox}>
      <div className={classes.imageContainer}>
        {country?.code && (
          <img
            src={`https://flagcdn.com/w320/${country?.code?.toLowerCase()}.png`}
            alt={`Flag of ${country?.name}`}
            className={classes.flag}
          />
        )}

        <div className={classes.detailsContainer}>
          <div className={classes.details}>
            <h2>{country?.name}</h2>
            <p>
              {country?.capital ? country?.capital + "," : ""}{" "}
              {country?.continent?.name}
            </p>
          </div>

          <div
            className={`${classes.moreDetails} ${showMore ? classes.show : ""}`}
          >
            <ul>
              {country?.languages?.map((language: TLanguage, index: number) => (
                <>
                  <li key={language?.name}>{language?.name}</li>
                  {index === country?.languages?.length - 1 ? "" : "|"}
                </>
              ))}
            </ul>
            <p>Currency: {country?.currency}</p>
            <p>Native: {country?.native}</p>
            <p>Phone Code: +{country?.phone}</p>

            <div className={classes.weatherContainer}>
              {weatherData ? (
                <>
                  <p>{convertKelvinToCelsius(weatherData?.temp)}°C</p>
                  <p>{weatherData?.description}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData?.icon}.png`}
                    alt={weatherData?.description}
                    className={classes.weatherIcon}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onViewMore(country)}
        className={`${classes.showMoreBtn} primary-btn`}
      >
        {showMore ? "Show Less" : "Show More"}
      </button>
    </div>
  );
}
