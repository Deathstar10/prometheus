import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerF,
} from "@react-google-maps/api";
import { useMemo, useState } from "react";

export default function Home() {
  const center = useMemo(() => ({ lat: 17, lng: 78 }), []);
  const [latitude, setLatitude] = useState(center.lat);
  const [longitude, setLongitude] = useState(center.lng);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  });

  function handleClick(e: google.maps.MapMouseEvent) {
    setLatitude(e.latLng?.lat);
    setLongitude(e.latLng?.lng);
  }

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <header className="bg-primaryColor text-[#fff] h-20">
        <h1>Prometheus</h1>
        <p>You can add, edit and delete new locations</p>
      </header>
      <main>
        <button className="bg-[#fff] text-primaryColor rounded border border-primaryColor w-3/5 py-2 md:w-1/5">
          Add new Location
        </button>
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
  );
}
