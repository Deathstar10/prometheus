import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

export default function Home() {
  const center = useMemo(() => ({ lat: 17, lng: 78 }), []);
  const [latitude, setLatitude] = useState(center.lat);
  const [longitude, setLongitude] = useState(center.lng);
  const [isMapVisible, setMapVisibility] = useState(false);

  const [locations, setLocation] = useState<Location[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });

  function handleClick(e: google.maps.MapMouseEvent) {
    setLatitude(e.latLng?.lat);
    setLongitude(e.latLng?.lng);
  }

  function addLocation() {
    setLocation([...locations, { lat: latitude, lng: longitude }]);

    // save this location to Local storage
    localStorage.setItem("locations", JSON.stringify(locations));

    setMapVisibility(false);
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
