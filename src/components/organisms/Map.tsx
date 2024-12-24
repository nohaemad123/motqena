"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { useState, useEffect } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import { HiOutlineSearch } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { BranchDto } from "@/@types/dto/BranchDto";

interface MapProps {
  setValue: (field: keyof BranchDto, value: any) => void;
  latitude: number | null;
  longitude: number | null;
  locationTitle: string;
  handleCloseLocateMap: () => void;
}

export default function Map({ setValue, latitude, longitude, locationTitle, handleCloseLocateMap }: MapProps) {
  const { t } = useTranslation();
  const [lat, setLat] = useState<number | null>(latitude); // Default latitude
  const [lng, setLng] = useState<number | null>(longitude); // Default longitude
  const [address, setAddress] = useState<string>(locationTitle); // Selected address
  const [searchValue, setSearchValue] = useState<string>(""); // Input value
  const [searchResults, setSearchResults] = useState<any[]>([]); // Autocomplete results

  // Fetch autocomplete results when `searchValue` changes
  useEffect(() => {
    if (searchValue.trim().length > 2) {
      const fetchResults = async () => {
        try {
          const url = `https://us1.locationiq.com/v1/autocomplete.php?q=${searchValue}&key=pk.a3066da026a102b61f5ed8a070c72f63&accept-language=ar`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data); // Set autocomplete results
          } else {
            console.error("Failed to fetch autocomplete results");
          }
        } catch (error) {
          console.error("Error fetching autocomplete data:", error);
        }
      };

      fetchResults();
    } else {
      setSearchResults([]); // Clear results if input is empty or too short
    }
  }, [searchValue]);

  const handlePlaceSelect = (place: any) => {
    if (place && place.lat && place.lon) {
      const newLat = parseFloat(place.lat);
      const newLng = parseFloat(place.lon);
      setLat(newLat);
      setLng(newLng);
      getAddressFromCoordinates(newLat, newLng);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        getAddressFromCoordinates(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const MapUpdate = () => {
    const map = useMap();
    if (lat !== null && lng !== null) {
      map.setView([lat, lng], map.getZoom());
    }
    return null;
  };

  // Fetch address from coordinates using an API
  async function getAddressFromCoordinates(lat: number, lng: number) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await response.json();
    if (response.ok) {
      setAddress(data.display_name);
    } else {
      console.log("Failed to fetch address");
    }
  }

  const handleMapConfirm = () => {
    setValue("latitude", lat); // Set latitude in the form
    setValue("longitude", lng);
    setValue("locationTitle", address); // Set address in the form
    handleCloseLocateMap();
  };

  const handleMapCancel = () => {
    setValue("latitude", null); // Set latitude in the form
    setValue("longitude", null);
    setValue("locationTitle", ""); //
    handleCloseLocateMap();
  };

  return (
    <div>
      <Autocomplete
        options={searchResults}
        getOptionLabel={(option) => option.display_name || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("Search for location")}
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
        onChange={(_event, value) => handlePlaceSelect(value)}
        noOptionsText="No results found"
        className="mb-4 mt-4"
        popupIcon={<HiOutlineSearch className="text-[#808080CC] w-[24px] h-[24px]" />} // Custom search icon
        sx={{
          "& .MuiAutocomplete-popupIndicator": {
            transform: "none !important", // Prevent the icon from rotating
          },
          "& .MuiAutocomplete-popupIndicatorOpen": {
            transform: "none !important", // Prevent rotation when the list is open
          },
        }}
      />

      <MapContainer
        center={[lat ?? 21.42251, lng ?? 39.826168]}
        className="mt-[25px]"
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdate />
        <MapClickHandler />
        {lat !== null && lng !== null && <Marker position={[lat, lng]} />}
      </MapContainer>

      {address && (
        <p className="mt-5">
          <strong>{t("address")}:</strong> {address}
        </p>
      )}
      <div className=" mt-5 flex gap-10 w-[60%] justify-center text-center m-auto">
        <Button disabled={lat === null || lng === null} onClick={handleMapConfirm} type="button" className="cancel_popup_button">
          {t("Confirm")}
        </Button>
        <Button type="button" onClick={handleMapCancel} className="back_popup_button">
          {t("Cancel")}
        </Button>
      </div>
    </div>
  );
}
