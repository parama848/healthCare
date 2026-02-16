import React, { useEffect, useState } from "react";
import {
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

const socket = io("http://localhost:5000");

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Emergency = () => {
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [hospitalLocation, setHospitalLocation] = useState(null);
  const [ambulanceLocation, setAmbulanceLocation] = useState(null);
  const [eta, setEta] = useState("");
  const [hospitalName, setHospitalName] = useState("");

  const handleSOS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        setUserLocation({ lat: latitude, lng: longitude });

        const response = await axios.post(
          "http://localhost:5000/api/emergency/activate",
          {
            lat: latitude,
            lng: longitude,
          }
        );

        setHospitalLocation(response.data.hospitalLocation);
        setHospitalName(response.data.hospital);
        setEta(response.data.eta);

        setActivated(true);
      } catch (error) {
        console.error(error);
        alert("Failed to activate emergency");
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    socket.on("ambulance:update", (data) => {
      setAmbulanceLocation(data);
    });

    socket.on("ambulance:arrived", () => {
      alert("🚑 Ambulance has arrived!");
    });

    return () => {
      socket.off("ambulance:update");
      socket.off("ambulance:arrived");
    };
  }, []);

  const resetEmergency = () => {
    setActivated(false);
    setAmbulanceLocation(null);
    setHospitalLocation(null);
    setEta("");
  };

  return (
    <div className="min-h-screen mt-10 bg-gray-100 flex justify-center">
      <div className="w-full max-w-md px-4 py-6">

        <h1 className="text-xl font-semibold text-red-600 flex items-center gap-2">
          <FaExclamationTriangle />
          Emergency SOS
        </h1>

        {!activated && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 text-center">
            <button
              onClick={handleSOS}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-red-600 text-white"
            >
              {loading ? "Activating..." : "ACTIVATE SOS"}
            </button>
          </div>
        )}

        {activated && (
          <div className="bg-green-50 border border-green-300 rounded-2xl p-6 mb-6 text-center">

            <FaCheckCircle className="text-green-600 text-4xl mx-auto mb-3" />

            <h2 className="text-green-700 font-semibold text-lg">
              Help is on the way!
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              Ambulance dispatched from {hospitalName}
            </p>

            <p className="text-green-700 font-semibold mb-3">
              ETA: {eta}
            </p>

            <button
              onClick={resetEmergency}
              className="bg-gray-200 px-4 py-2 rounded-xl text-sm"
            >
              Reset Emergency
            </button>
          </div>
        )}

        {/* 🔥 FREE LIVE MAP */}
        {userLocation && (
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={14}
            style={{
              height: "400px",
              width: "100%",
              borderRadius: "16px",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>You</Popup>
            </Marker>

            {/* Hospital */}
            {hospitalLocation && (
              <Marker
                position={[
                  hospitalLocation.lat,
                  hospitalLocation.lng,
                ]}
              >
                <Popup>{hospitalName}</Popup>
              </Marker>
            )}

            {/* Ambulance */}
            {ambulanceLocation && (
              <Marker
                position={[
                  ambulanceLocation.lat,
                  ambulanceLocation.lng,
                ]}
              >
                <Popup>Ambulance</Popup>
              </Marker>
            )}

            {/* Optional Line */}
            {hospitalLocation && (
              <Polyline
                positions={[
                  [userLocation.lat, userLocation.lng],
                  [hospitalLocation.lat, hospitalLocation.lng],
                ]}
                color="blue"
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default Emergency;
