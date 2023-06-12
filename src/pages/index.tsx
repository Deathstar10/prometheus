import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";
import WeatherInfo from "@/components/WeatherInfo";
import { z } from "zod";
interface Location {
  lat: number;
  lng: number;
}

const WeatherData = z.object({
  timezone: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  currently: z.object({
    temperature: z.number(),
    windSpeed: z.number(),
    humidity: z.number(),
    summary: z.string(),
  }),
});

interface Data {
  timezone: string;
  temperature: number;
  latitude: number;
  longitude: number;
  windSpeed: number;
  humidity: number;
  summary: string;
}

function fetchWeatherData(latitude: number, longitude: number) {
  // TODO : type this appropriately
  const data: any = fetch(
    `http://prometheus-api.zkx.fi/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`
  ).then((res) => res.json());

  const parsedData = WeatherData.parse(data[0]);
  return parsedData;
}

export default function Home() {
  const center = useMemo(() => ({ lat: 17, lng: 78 }), []);
  const [latitude, setLatitude] = useState(center.lat);
  const [longitude, setLongitude] = useState(center.lng);
  const [isMapVisible, setMapVisibility] = useState(false);
  const [weatherData, setWeatherData] = useState<Data[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });

  function handleClick(e: google.maps.MapMouseEvent) {
    setLatitude(e.latLng?.lat);
    setLongitude(e.latLng?.lng);
  }

  function addLocation() {
    const data = fetchWeatherData(latitude, longitude);

    let newWeatherData = [
      ...weatherData,
      {
        timezone: data.timezone,
        humidity: data.currently.humidity,
        temperature: data.currently.temperature,
        latitude: data.latitude,
        longitude: data.longitude,
        windSpeed: data.currently.windSpeed,
        summary: data.currently.summary,
      },
    ];

    setWeatherData(newWeatherData);

    // save this location to Local storage
    localStorage.setItem(
      "locations",
      JSON.stringify({ lat: data.latitude, lng: data.longitude })
    );

    setMapVisibility(false);
  }

  function editLocation(latitude: number, longitude: number) {
    const locations = weatherData.filter(
      (data) => data.latitude !== latitude || data.longitude !== longitude
    );
    setWeatherData(locations);
    setMapVisibility(true);
  }

  function deleteLocation(latitude: number, longitude: number) {
    const remainingLocations = weatherData.filter(
      (data) => data.latitude !== latitude || data.longitude !== longitude
    );

    setWeatherData(remainingLocations);
  }

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {isMapVisible ? (
        <>
          <header className="bg-primaryColor text-[#fff] h-1/5">
            <button className="pl-2 pt-2" onClick={addLocation}>
              Add new Location
            </button>
            <p className="pl-2">
              {latitude} , {longitude}
            </p>
          </header>
          <main>
            <GoogleMap
              zoom={10}
              center={center}
              mapContainerClassName="w-full h-screen"
              onClick={handleClick}
            >
              <MarkerF position={{ lat: latitude, lng: longitude }}></MarkerF>
            </GoogleMap>
          </main>
        </>
      ) : (
        <>
          <header className="bg-primaryColor text-[#fff] h-20 flex justify-between">
            <div>
              <h1>Prometheus</h1>
              <p>You can add, edit and delete new locations</p>
            </div>
            <div></div>
          </header>
          <ul aria-labelledby="list">
            {weatherData.map((data) => (
              <WeatherInfo
                key={data.longitude}
                place={data.timezone}
                temperature={data.temperature}
                humidity={data.humidity}
                latitude={data.latitude}
                longitude={data.longitude}
                summary={data.summary}
                windSpeed={data.windSpeed}
                editLocation={editLocation}
                deleteLocation={deleteLocation}
              />
            ))}
          </ul>
          <div className="flex justify-center">
            <button
              onClick={() => setMapVisibility(true)}
              className="bg-[#fff] text-primaryColor w-3/5 md:w-1/5 py-2 border rounded border-primaryColor mt-10 mx-auto font-bold"
            >
              Add new Locations
            </button>
          </div>
        </>
      )}
    </>
  );
}
