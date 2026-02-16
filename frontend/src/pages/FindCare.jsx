import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaSearch, FaStar, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const FindCare = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("hospitals");
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("Detecting...");
  const [manualCity, setManualCity] = useState("");
  const [showChange, setShowChange] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [hospitalPage, setHospitalPage] = useState(1);
  const [doctorPage, setDoctorPage] = useState(1);

  // 📍 Detect Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLocation({ lat, lng });

      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      setCity(res.data.address.city || res.data.address.state);
    });
  }, []);

  // 🏥 Fetch Hospitals
  useEffect(() => {
    if (!location) return;

    const fetchHospitals = async () => {
      setLoading(true);

      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:4000,${location.lat},${location.lng});
          node["amenity"="clinic"](around:4000,${location.lat},${location.lng});
        );
        out body;
      `;

      const res = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "text/plain" } }
      );

      const hospitalData = res.data.elements
        .filter((item) => item.tags.name)
        .map((item) => ({
          id: item.id,
          name: item.tags.name,
          address:
            item.tags["addr:street"] ||
            item.tags["addr:full"] ||
            city,
          phone: item.tags.phone || "Not Available",
          rating: (4 + Math.random()).toFixed(1),
        }));

      setHospitals(hospitalData);
      setLoading(false);
    };

    fetchHospitals();
  }, [location]);

  // 🔄 Change Location
  const changeCity = async () => {
    if (!manualCity) return;

    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${manualCity}`
    );

    if (res.data.length > 0) {
      setLocation({
        lat: parseFloat(res.data[0].lat),
        lng: parseFloat(res.data[0].lon),
      });
      setCity(manualCity);
      setShowChange(false);
    }
  };

  // 🔍 Filter Hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) =>
      h.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [hospitals, search]);

  // 👨‍⚕️ Generate Doctors
  const doctors = useMemo(() => {
    return filteredHospitals.flatMap((hospital) => {
      const spec = hospital.name.includes("Children")
        ? "Pediatrician"
        : hospital.name.includes("Heart")
        ? "Cardiologist"
        : "General Physician";

      return [
        {
          id: hospital.id + "-1",
          name: `Dr. ${hospital.name.split(" ")[0]}`,
          specialization: spec,
          hospital: hospital.name,
          rating: hospital.rating,
          experience: Math.floor(Math.random() * 15) + 5,
          fee: Math.floor(Math.random() * 500) + 500,
        },
      ];
    });
  }, [filteredHospitals]);

  // 📄 Pagination Logic

  const hospitalTotalPages = Math.ceil(
    filteredHospitals.length / ITEMS_PER_PAGE
  );

  const doctorTotalPages = Math.ceil(
    doctors.length / ITEMS_PER_PAGE
  );

  const paginatedHospitals = useMemo(() => {
    const start = (hospitalPage - 1) * ITEMS_PER_PAGE;
    return filteredHospitals.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [filteredHospitals, hospitalPage]);

  const paginatedDoctors = useMemo(() => {
    const start = (doctorPage - 1) * ITEMS_PER_PAGE;
    return doctors.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [doctors, doctorPage]);

  // Reset pages on search or tab change
  useEffect(() => {
    setHospitalPage(1);
    setDoctorPage(1);
  }, [search, activeTab]);

  return (
    <div className="min-h-screen mt-10 bg-gray-100 flex justify-center">
      <div className="w-full max-w-md px-4 py-6">

        <h1 className="text-xl font-semibold">Find Care</h1>
        <p className="text-gray-500 text-sm mb-5">
          Discover hospitals & doctors near you
        </p>

        {/* Location */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <FaMapMarkerAlt className="text-blue-600 text-sm" />
              <div>
                <p className="text-xs text-gray-500">
                  Current Location
                </p>
                <p className="text-sm font-medium">{city}</p>
              </div>
            </div>
            <button
              onClick={() => setShowChange(!showChange)}
              className="text-blue-600 text-sm"
            >
              Change
            </button>
          </div>

          {showChange && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Enter city..."
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={changeCity}
                className="bg-blue-600 text-white px-3 rounded"
              >
                Set
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white p-3 rounded-xl shadow-sm mb-4 flex items-center gap-2">
          <FaSearch className="text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none w-full text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-200 rounded-xl mb-5 text-sm">
          <button
            onClick={() => setActiveTab("hospitals")}
            className={`flex-1 py-2 rounded-xl ${
              activeTab === "hospitals"
                ? "bg-white shadow font-medium"
                : "text-gray-500"
            }`}
          >
            Hospitals ({filteredHospitals.length})
          </button>

          <button
            onClick={() => setActiveTab("doctors")}
            className={`flex-1 py-2 rounded-xl ${
              activeTab === "doctors"
                ? "bg-white shadow font-medium"
                : "text-gray-500"
            }`}
          >
            Doctors ({doctors.length})
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {/* Hospitals */}
        {activeTab === "hospitals" && (
          <>
            {paginatedHospitals.map((hospital) => (
              <div key={hospital.id} className="bg-white p-4 rounded-xl mb-4 shadow">
                <h2 className="font-semibold">{hospital.name}</h2>
                <p className="text-xs text-gray-500">{hospital.address}</p>
                <div className="flex gap-3 mt-2 text-xs">
                  <FaStar className="text-yellow-400" />
                  {hospital.rating}
                </div>
                <div className="flex items-center gap-2 text-xs mt-2">
                  <FaPhone />
                  {hospital.phone}
                </div>
              </div>
            ))}

            {/* Hospital Pagination */}
            <div className="flex justify-center flex-wrap gap-2 mt-4">
              {Array.from({ length: hospitalTotalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setHospitalPage(page)}
                    className={`px-3 py-1 rounded ${
                      hospitalPage === page
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </>
        )}

        {/* Doctors */}
        {activeTab === "doctors" && (
          <>
            {paginatedDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white p-4 rounded-xl mb-4 shadow">
                <div
                  onClick={() =>
                    navigate(`/doctor/${doctor.id}`, { state: doctor })
                  }
                  className="cursor-pointer"
                >
                  <h2 className="font-semibold">{doctor.name}</h2>
                  <p className="text-blue-600 text-sm">
                    {doctor.specialization}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doctor.hospital}
                  </p>
                  <div className="flex gap-2 text-xs mt-1">
                    <FaStar className="text-yellow-400" />
                    {doctor.rating}
                    <span>{doctor.experience} yrs</span>
                    ₹{doctor.fee}
                  </div>
                </div>

                <button
                  className="mt-3 w-full bg-teal-600 text-white py-2 rounded-lg"
                  onClick={() =>
                    navigate(`/booking/${doctor.id}`, { state: doctor })
                  }
                >
                  Book Appointment
                </button>
              </div>
            ))}

            {/* Doctor Pagination */}
            <div className="flex justify-center flex-wrap gap-2 mt-4">
              {Array.from({ length: doctorTotalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setDoctorPage(page)}
                    className={`px-3 py-1 rounded ${
                      doctorPage === page
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FindCare;
