import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaUpload,
  FaHospital,
  FaExclamationTriangle,
  FaWallet,
  FaFileMedical,
  FaUserMd,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Axios Instance
  const API = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:5000/api",
    });

    instance.interceptors.request.use((req) => {
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    });

    return instance;
  }, [token]);

  // ================= FETCH DASHBOARD DATA =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get logged-in user profile
        const userRes = await API.get("/users/profile");
        const userData = userRes.data;

        if (!userData?._id) {
          throw new Error("Invalid user data");
        }

        setUser(userData);

        // ✅ FIXED ROUTES (no userId required)
        const [recordRes, walletRes, bookingRes] = await Promise.all([
          API.get("/medical-records"),
          API.get("/wallet"),
          API.get("/bookings"),
        ]);

        setRecords(Array.isArray(recordRes.data) ? recordRes.data : []);

        setWalletBalance(walletRes.data?.balance || 0);

        setBookings(Array.isArray(bookingRes.data) ? bookingRes.data : []);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        User not found
      </div>
    );

  // ================= LAST BOOKED APPOINTMENT =================
  const lastBookedAppointment = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  )[0];

  const recentRecords = records.slice(0, 3);

  const allergyCount = user.allergies?.length || 0;
  const medicationCount = user.medications?.length || 0;

  const actions = [
    { icon: <FaUpload />, label: "Upload", path: "/upload-file" },
    { icon: <FaHospital />, label: "Hospital", path: "/find-care" },
    { icon: <FaExclamationTriangle />, label: "Emergency", path: "/emergency" },
    { icon: <FaWallet />, label: "Wallet", path: "/wallet" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 overflow-x-hidden">
      <div className="w-full max-w-md mx-auto">
        {/* Greeting */}
        <h1 className="text-xl font-semibold">Hello, {user.name} 👋</h1>
        <p className="text-gray-500 text-sm mb-6">How are you feeling today?</p>

        {/* Profile Card */}
        <div className="bg-teal-600 text-white rounded-2xl p-5 shadow-md mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white text-teal-600 w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-xs opacity-80">
                {user.medicalId || "MED-XXXX"}
              </p>
              <p className="text-xs mt-1">
                {user.bloodGroup || "—"} • {user.age || 0} yrs •{" "}
                {user.gender || "—"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 text-center">
            <div className="bg-teal-500 py-3 rounded-xl">
              <h3 className="text-lg font-bold">{records.length}</h3>
              <p className="text-xs">Records</p>
            </div>
            <div className="bg-teal-500 py-3 rounded-xl">
              <h3 className="text-lg font-bold">{allergyCount}</h3>
              <p className="text-xs">Allergies</p>
            </div>
            <div className="bg-teal-500 py-3 rounded-xl">
              <h3 className="text-lg font-bold">{medicationCount}</h3>
              <p className="text-xs">Medications</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3 text-sm">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {actions.map((action, index) => (
              <div
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-white p-3 rounded-xl shadow text-center cursor-pointer hover:shadow-md transition"
              >
                <div className="text-teal-600 text-lg mb-1 flex justify-center">
                  {action.icon}
                </div>
                <p className="text-xs">{action.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* digital reward */}
        {/* DigiMed Rewards */}
        <Link to="/digital-reward">
        <div className="mb-6">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
            {/* Streak Badge */}
            <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              🔥 12 day streak
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">⭐</span>
              <h2 className="text-sm font-semibold">DigiMed Rewards</h2>
            </div>

            {/* Points */}
            <h3 className="text-3xl font-bold">1,250</h3>
            <p className="text-xs opacity-90 mb-4">points available</p>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1 opacity-90">
                <span>Next: Health Champion</span>
                <span>75%</span>
              </div>

              <div className="w-full bg-white/30 h-2 rounded-full">
                <div className="bg-white h-2 rounded-full w-[75%]" />
              </div>
            </div>
          </div>
        </div>
        </Link>

        {/* Wallet */}
        <div
          onClick={() => navigate("/wallet")}
          className="bg-white p-4 rounded-xl shadow mb-5 cursor-pointer hover:shadow-md transition"
        >
          <p className="text-xs text-gray-500">Medical Savings</p>
          <h2 className="text-lg font-bold mt-1">
            ₹{walletBalance.toLocaleString()}
          </h2>
        </div>

        {/* Last Booked Appointment */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3 text-sm">
            Last Booked Appointment
          </h2>

          {!lastBookedAppointment ? (
            <p className="text-xs text-gray-500">No bookings found.</p>
          ) : (
            <div className="bg-white p-4 rounded-xl shadow flex items-start gap-3">
              <FaUserMd className="text-teal-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold">
                  {lastBookedAppointment.doctorName}
                </h3>
                <p className="text-xs text-gray-500">
                  {lastBookedAppointment.specialization}
                </p>
                <p className="text-xs text-gray-400">
                  Hospital: {lastBookedAppointment.hospital}
                </p>
                <p className="text-xs text-gray-400">
                  Date:{" "}
                  {new Date(
                    lastBookedAppointment.appointmentDate,
                  ).toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-teal-600">
                  ₹{lastBookedAppointment.fee}
                </p>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mt-1 inline-block">
                  {lastBookedAppointment.status}
                </span>
              </div>
              <FaChevronRight className="text-gray-400 mt-2" />
            </div>
          )}
        </div>
      </div>

      {/* Floating Emergency Button */}
      <button
        onClick={() => navigate("/emergency")}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition transform hover:scale-110 animate-pulse z-50"
      >
        <FaExclamationTriangle />
      </button>
    </div>
  );
};

export default Home;
