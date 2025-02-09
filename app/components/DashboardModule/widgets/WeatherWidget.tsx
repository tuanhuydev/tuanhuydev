"use client";

import Card from "@app/components/commons/Card";
import { openWeatherKey } from "@lib/configs/constants";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import CloudIcon from "@mui/icons-material/Cloud";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { FC, Fragment, ReactNode, useCallback, useEffect, useState } from "react";

const iconMap: Record<string, ReactNode> = {
  "01n": <NightsStayIcon />, // Clear night
  "01d": <WbSunnyIcon />, // Clear day
  "02n": <CloudIcon />, // Few clouds (night)
  "13n": <AcUnitIcon />, // Snowy night
};

function kelvinToCelsius(value: number) {
  // Official fomula
  return Number(value - 273.15).toFixed(2);
}

const WeatherIcon: FC<{ code: string }> = ({ code }) => {
  if (!code) {
    return <span>❓</span>;
  }
  return iconMap[code];
};

type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type WeatherState = {
  base: string;
  clouds: ObjectType[];
  coord: {
    lon: number;
    lat: number;
  };
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  weather: Weather[];
};

export const WeatherWidget = () => {
  const [weatherState, setWeatherState] = useState<Partial<WeatherState>>({} as unknown as Partial<WeatherState>);

  const fetchWeatherByCoords = useCallback(async (latitude: number, longitude: number) => {
    if (openWeatherKey) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}`,
        );
        if (!response.ok) throw Error("Unable to get weather data");
        const currentWeather = await response.json();
        setWeatherState(currentWeather);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      });
    }
  }, [fetchWeatherByCoords]);

  const { name = "Today weather", weather = [], main } = weatherState;
  const icon = weather[0]?.icon || "";
  const temp = kelvinToCelsius(main?.temp || 0);
  const tempMin = kelvinToCelsius(main?.temp_min || 0);
  const tempMax = kelvinToCelsius(main?.temp_max || 0);

  if (!openWeatherKey) {
    return <Fragment />;
  }

  return (
    <Card title={name} className="w-[20rem] min-h-[8rem] overflow-hidden" icon={<WeatherIcon code={icon} />}>
      <h3 className="font-bold m-0 text-3xl">{temp} &deg;C</h3>
      <div className="flex text-slate-600">
        <span className="text-sm font-medium m-0 ">{tempMin}&deg;C</span>&nbsp;-&nbsp;
        <span className="text-sm font-medium m-0">{tempMax}&deg;C</span>
      </div>
    </Card>
  );
};
