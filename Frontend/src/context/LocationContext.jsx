import React, { createContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState("");
  const [displayLocation, setDisplayLocation] = useState("Detecting location...");

  // Fetch current location and update city
  const fetchCurrentLocation = () => {
    setDisplayLocation("Detecting location...");
    if (!navigator.geolocation) {
      setDisplayLocation("Geolocation not supported");
      setCity("");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const address = data.address;
          const currentCity =
            address.city ||
            address.town ||
            address.village ||
            address.county ||
            "";

          if (currentCity) {
            setCity(currentCity);
            setDisplayLocation(currentCity + ", " + (address.country || ""));
          } else {
            setDisplayLocation("City not found");
          }
        } catch {
          setDisplayLocation("Location unavailable");
          setCity("");
        }
      },
      () => {
        setDisplayLocation("Location permission denied");
        setCity("");
      }
    );
  };

  // On mount, fetch current location automatically
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        city,
        setCity,
        displayLocation,
        setDisplayLocation,
        fetchCurrentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
