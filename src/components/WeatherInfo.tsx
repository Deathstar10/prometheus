export default function WeatherInfo({
  place,
  temperature,
  latitude,
  longitude,
  windSpeed,
  humidity,
  summary,
  editLocation,
  deleteLocation,
}: {
  place: string;
  temperature: number;
  latitude: number;
  longitude: number;
  windSpeed: number;
  humidity: number;
  summary: string;
}) {
  function handleClick() {
    editLocation(latitude, longitude);
  }

  function handleDelete() {
    deleteLocation(latitude, longitude);
  }
  return (
    <>
      <div className="flex justify-between mt-2">
        <div className="flex">
          <div className="px-2">{temperature}</div>
          <div>
            <p>
              {place} {latitude} {longitude}{" "}
            </p>
            <p>{summary}</p>
          </div>
        </div>
        <div>
          <button
            onClick={handleClick}
            className="bg-primaryColor text-[#fff] rounded w-32 px-4 py-1 mr-2"
          >
            Edit <span className="sr-only">{place}</span>
          </button>
          <button
            className="bg-red-500 text-[#fff] rounded w-32 px-4 py-1 mr-2"
            onClick={handleDelete}
          >
            Delete <span className="sr-only">{place}</span>
          </button>
        </div>
      </div>
      <div className="flex">
        <p>Wind Speed {windSpeed} KM/H</p>
        <p>Humidity {humidity}</p>
      </div>
    </>
  );
}
