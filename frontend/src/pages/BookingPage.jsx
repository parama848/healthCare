// // // import { useLocation, useNavigate } from "react-router-dom";
// // // import { useState } from "react";
// // // import axios from "axios";
// // // import { FaStar, FaVideo, FaHospital, FaClock } from "react-icons/fa";

// // // const BookingPage = () => {
// // //   const { state } = useLocation();
// // //   const navigate = useNavigate();

// // //   const userId = "6990b964a6a695c1ad0916fc";

// // //   const [consultType, setConsultType] = useState("inperson");
// // //   const [selectedDate, setSelectedDate] = useState("");
// // //   const [selectedTime, setSelectedTime] = useState("");
// // //   const [processing, setProcessing] = useState(false);

// // //   if (!state) return <p>No Booking Data</p>;

// // //   const fee = Number(state.fee || 800);

// // //   // Prevent selecting past dates
// // //   const today = new Date().toISOString().split("T")[0];

// // //   // Sample Time Slots
// // //   const timeSlots = [
// // //     "09:00 AM",
// // //     "10:00 AM",
// // //     "11:00 AM",
// // //     "01:00 PM",
// // //     "02:00 PM",
// // //     "04:00 PM",
// // //     "06:00 PM",
// // //   ];

// // //   // ================= CONFIRM BOOKING =================
// // //   const handleConfirmBooking = async () => {
// // //     if (!selectedDate) {
// // //       alert("Please select appointment date");
// // //       return;
// // //     }

// // //     if (!selectedTime) {
// // //       alert("Please select appointment time");
// // //       return;
// // //     }

// // //     try {
// // //       setProcessing(true);

// // //       await axios.post(
// // //         `http://localhost:5000/api/wallet/deduct/${userId}`,
// // //         {
// // //           amount: fee,
// // //           category: "CONSULTATION",
// // //           description: `Consultation - ${state.name}`,
// // //           partnerName: state.hospital,
// // //           doctorName: state.name,
// // //           specialization: state.specialization,
// // //           consultType,
// // //           appointmentDate: selectedDate,
// // //           appointmentTime: selectedTime,   // ✅ Added time
// // //         }
// // //       );

// // //       alert("Appointment Confirmed 🎉");
// // //       navigate("/");

// // //     } catch (err) {
// // //       alert(err.response?.data?.message || "Booking failed");
// // //     } finally {
// // //       setProcessing(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-100 p-6 max-w-md mx-auto">

// // //       {/* Back */}
// // //       <button
// // //         onClick={() => navigate(-1)}
// // //         className="text-gray-600 mb-4"
// // //       >
// // //         ← Back
// // //       </button>

// // //       {/* Doctor Info */}
// // //       <div className="bg-white p-5 rounded-2xl shadow">
// // //         <div className="flex gap-4">
// // //           <div className="bg-teal-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold">
// // //             {state.name.charAt(0)}
// // //           </div>

// // //           <div>
// // //             <h2 className="font-semibold text-lg">
// // //               {state.name}
// // //             </h2>
// // //             <p className="text-blue-600 text-sm">
// // //               {state.specialization}
// // //             </p>
// // //             <p className="text-gray-500 text-xs">
// // //               {state.hospital}
// // //             </p>

// // //             <div className="flex items-center gap-2 mt-1 text-sm">
// // //               <FaStar className="text-yellow-400" />
// // //               {state.rating}
// // //               <span className="text-gray-500">
// // //                 {state.experience || 15} yrs exp
// // //               </span>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <hr className="my-4" />

// // //         <div className="flex justify-between items-center">
// // //           <p className="text-gray-600">Consultation Fee</p>
// // //           <p className="text-teal-600 font-bold text-lg">
// // //             ₹{fee}
// // //           </p>
// // //         </div>
// // //       </div>

// // //       {/* Consultation Type */}
// // //       <div className="bg-white p-5 rounded-2xl shadow mt-6">
// // //         <h3 className="font-semibold mb-4">
// // //           Consultation Type
// // //         </h3>

// // //         <div className="flex gap-4">
// // //           <button
// // //             onClick={() => setConsultType("inperson")}
// // //             className={`flex-1 border rounded-xl p-4 text-center ${
// // //               consultType === "inperson"
// // //                 ? "border-teal-600 bg-teal-50"
// // //                 : "border-gray-200"
// // //             }`}
// // //           >
// // //             <FaHospital className="text-teal-600 mb-2 mx-auto" />
// // //             <p>In-Person</p>
// // //           </button>

// // //           <button
// // //             onClick={() => setConsultType("video")}
// // //             className={`flex-1 border rounded-xl p-4 text-center ${
// // //               consultType === "video"
// // //                 ? "border-teal-600 bg-teal-50"
// // //                 : "border-gray-200"
// // //             }`}
// // //           >
// // //             <FaVideo className="text-teal-600 mb-2 mx-auto" />
// // //             <p>Video Call</p>
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Date Picker */}
// // //       <div className="bg-white p-5 rounded-2xl shadow mt-6">
// // //         <h3 className="font-semibold mb-4">
// // //           Select Appointment Date
// // //         </h3>

// // //         <input
// // //           type="date"
// // //           min={today}
// // //           value={selectedDate}
// // //           onChange={(e) => setSelectedDate(e.target.value)}
// // //           className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-teal-600"
// // //         />
// // //       </div>

// // //       {/* Time Picker */}
// // //       <div className="bg-white p-5 rounded-2xl shadow mt-6">
// // //         <h3 className="font-semibold mb-4 flex items-center gap-2">
// // //           <FaClock className="text-teal-600" />
// // //           Select Appointment Time
// // //         </h3>

// // //         <div className="grid grid-cols-3 gap-3">
// // //           {timeSlots.map((time, index) => (
// // //             <button
// // //               key={index}
// // //               onClick={() => setSelectedTime(time)}
// // //               className={`border rounded-xl py-2 text-sm ${
// // //                 selectedTime === time
// // //                   ? "bg-teal-600 text-white border-teal-600"
// // //                   : "border-gray-300"
// // //               }`}
// // //             >
// // //               {time}
// // //             </button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Confirm Button */}
// // //       <button
// // //         disabled={processing}
// // //         onClick={handleConfirmBooking}
// // //         className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition"
// // //       >
// // //         {processing ? "Processing..." : "Confirm Appointment"}
// // //       </button>
// // //     </div>
// // //   );
// // // };

// // // export default BookingPage;

// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useState, useMemo } from "react";
// // import axios from "axios";
// // import { FaStar, FaVideo, FaHospital, FaClock } from "react-icons/fa";

// // const BookingPage = () => {
// //   const { state } = useLocation();
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem("token");

// //   const [consultType, setConsultType] = useState("inperson");
// //   const [selectedDate, setSelectedDate] = useState("");
// //   const [selectedTime, setSelectedTime] = useState("");
// //   const [processing, setProcessing] = useState(false);
// //   const [error, setError] = useState("");

// //   if (!state) return <p className="text-center mt-10">No Booking Data</p>;

// //   const fee = Number(state.fee || 800);
// //   const today = new Date().toISOString().split("T")[0];

// //   // ✅ Professional Axios Instance
// //   const API = useMemo(() => {
// //     const instance = axios.create({
// //       baseURL: "http://localhost:5000/api",
// //     });

// //     instance.interceptors.request.use((req) => {
// //       if (token) req.headers.Authorization = `Bearer ${token}`;
// //       return req;
// //     });

// //     return instance;
// //   }, [token]);

// //   const timeSlots = [
// //     "09:00 AM",
// //     "10:00 AM",
// //     "11:00 AM",
// //     "01:00 PM",
// //     "02:00 PM",
// //     "04:00 PM",
// //     "06:00 PM",
// //   ];

// //   // ================= CONFIRM BOOKING =================
// //   const handleConfirmBooking = async () => {
// //     try {
// //       setError("");

// //       if (!selectedDate) throw new Error("Select appointment date");
// //       if (!selectedTime) throw new Error("Select appointment time");

// //       setProcessing(true);

// //       // ✅ Correct endpoint (NO userId in URL)
// //       await API.post("/wallet/deduct", {
// //         amount: fee,
// //         category: "CONSULTATION",
// //         description: `Consultation - ${state.name}`,
// //         partnerName: state.hospital,
// //         doctorName: state.name,
// //         specialization: state.specialization,
// //         consultType,
// //         appointmentDate: selectedDate,
// //         appointmentTime: selectedTime,
// //       });

// //       navigate("/", { replace: true });

// //     } catch (err) {
// //       setError(err.response?.data?.message || "Booking failed");
// //     } finally {
// //       setProcessing(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-6 max-w-md mx-auto">

// //       {/* Back */}
// //       <button
// //         onClick={() => navigate(-1)}
// //         className="text-gray-600 mb-4"
// //       >
// //         ← Back
// //       </button>

// //       {/* Doctor Info */}
// //       <div className="bg-white p-5 rounded-2xl shadow">
// //         <div className="flex gap-4">
// //           <div className="bg-teal-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold">
// //             {state.name.charAt(0)}
// //           </div>

// //           <div>
// //             <h2 className="font-semibold text-lg">{state.name}</h2>
// //             <p className="text-blue-600 text-sm">{state.specialization}</p>
// //             <p className="text-gray-500 text-xs">{state.hospital}</p>

// //             <div className="flex items-center gap-2 mt-1 text-sm">
// //               <FaStar className="text-yellow-400" />
// //               {state.rating}
// //               <span className="text-gray-500">
// //                 {state.experience || 15} yrs exp
// //               </span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex justify-between mt-4">
// //           <p className="text-gray-600">Consultation Fee</p>
// //           <p className="text-teal-600 font-bold text-lg">₹{fee}</p>
// //         </div>
// //       </div>

// //       {/* Consultation Type */}
// //       <div className="bg-white p-5 rounded-2xl shadow mt-6">
// //         <h3 className="font-semibold mb-4">Consultation Type</h3>

// //         <div className="flex gap-4">
// //           {["inperson", "video"].map((type) => (
// //             <button
// //               key={type}
// //               onClick={() => setConsultType(type)}
// //               className={`flex-1 border rounded-xl p-4 text-center ${
// //                 consultType === type
// //                   ? "border-teal-600 bg-teal-50"
// //                   : "border-gray-200"
// //               }`}
// //             >
// //               {type === "inperson" ? (
// //                 <FaHospital className="text-teal-600 mb-2 mx-auto" />
// //               ) : (
// //                 <FaVideo className="text-teal-600 mb-2 mx-auto" />
// //               )}
// //               {type === "inperson" ? "In-Person" : "Video Call"}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Date Picker */}
// //       <div className="bg-white p-5 rounded-2xl shadow mt-6">
// //         <h3 className="font-semibold mb-4">Select Appointment Date</h3>
// //         <input
// //           type="date"
// //           min={today}
// //           value={selectedDate}
// //           onChange={(e) => setSelectedDate(e.target.value)}
// //           className="w-full border border-gray-300 p-3 rounded-xl focus:border-teal-600"
// //         />
// //       </div>

// //       {/* Time Picker */}
// //       <div className="bg-white p-5 rounded-2xl shadow mt-6">
// //         <h3 className="font-semibold mb-4 flex items-center gap-2">
// //           <FaClock className="text-teal-600" />
// //           Select Appointment Time
// //         </h3>

// //         <div className="grid grid-cols-3 gap-3">
// //           {timeSlots.map((time) => (
// //             <button
// //               key={time}
// //               onClick={() => setSelectedTime(time)}
// //               className={`border rounded-xl py-2 text-sm ${
// //                 selectedTime === time
// //                   ? "bg-teal-600 text-white border-teal-600"
// //                   : "border-gray-300"
// //               }`}
// //             >
// //               {time}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {error && (
// //         <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
// //       )}

// //       {/* Confirm Button */}
// //       <button
// //         disabled={processing}
// //         onClick={handleConfirmBooking}
// //         className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium transition"
// //       >
// //         {processing ? "Processing..." : "Confirm Appointment"}
// //       </button>
// //     </div>
// //   );
// // };

// // export default BookingPage;

// import { useLocation, useNavigate } from "react-router-dom";
// import { useState, useMemo } from "react";
// import axios from "axios";
// import { FaStar, FaVideo, FaHospital, FaClock } from "react-icons/fa";

// const BookingPage = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("userId");

//   const [consultType, setConsultType] = useState("inperson");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState("");

//   if (!state)
//     return <p className="text-center mt-10">No Booking Data</p>;

//   const fee = Number(state.fee || 800);
//   const today = new Date().toISOString().split("T")[0];

//   // Axios instance
//   const API = useMemo(() => {
//     const instance = axios.create({
//       baseURL: "http://localhost:5000/api",
//     });

//     instance.interceptors.request.use((req) => {
//       if (token) req.headers.Authorization = `Bearer ${token}`;
//       return req;
//     });

//     return instance;
//   }, [token]);

//   const timeSlots = [
//     "09:00 AM",
//     "10:00 AM",
//     "11:00 AM",
//     "01:00 PM",
//     "02:00 PM",
//     "04:00 PM",
//     "06:00 PM",
//   ];

//   // ================= CONFIRM BOOKING =================
//   const handleConfirmBooking = async () => {
//     try {
//       setError("");

//       if (!selectedDate) throw new Error("Select appointment date");
//       if (!selectedTime) throw new Error("Select appointment time");
//       if (!userId) throw new Error("User not logged in");

//       setProcessing(true);

//       await API.post(`/wallet/deduct/${userId}`, {
//         amount: fee,
//         category: "CONSULTATION",
//         description: `Consultation - ${state.name}`,
//         partnerName: state.hospital,
//         doctorName: state.name,
//         specialization: state.specialization,
//         consultType,
//         appointmentDate: selectedDate,
//         appointmentTime: selectedTime,
//       });

//       alert("Appointment Confirmed 🎉");
//       navigate("/", { replace: true });

//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         "Booking failed"
//       );
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 max-w-md mx-auto">

//       {/* Back */}
//       <button
//         onClick={() => navigate(-1)}
//         className="text-gray-600 mb-4"
//       >
//         ← Back
//       </button>

//       {/* Doctor Info */}
//       <div className="bg-white p-5 rounded-2xl shadow">
//         <div className="flex gap-4">
//           <div className="bg-teal-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold">
//             {state.name.charAt(0)}
//           </div>

//           <div>
//             <h2 className="font-semibold text-lg">{state.name}</h2>
//             <p className="text-blue-600 text-sm">{state.specialization}</p>
//             <p className="text-gray-500 text-xs">{state.hospital}</p>

//             <div className="flex items-center gap-2 mt-1 text-sm">
//               <FaStar className="text-yellow-400" />
//               {state.rating}
//               <span className="text-gray-500">
//                 {state.experience || 15} yrs exp
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-between mt-4">
//           <p className="text-gray-600">Consultation Fee</p>
//           <p className="text-teal-600 font-bold text-lg">₹{fee}</p>
//         </div>
//       </div>

//       {/* Consultation Type */}
//       <div className="bg-white p-5 rounded-2xl shadow mt-6">
//         <h3 className="font-semibold mb-4">Consultation Type</h3>

//         <div className="flex gap-4">
//           {["inperson", "video"].map((type) => (
//             <button
//               key={type}
//               onClick={() => setConsultType(type)}
//               className={`flex-1 border rounded-xl p-4 text-center ${
//                 consultType === type
//                   ? "border-teal-600 bg-teal-50"
//                   : "border-gray-200"
//               }`}
//             >
//               {type === "inperson" ? (
//                 <FaHospital className="text-teal-600 mb-2 mx-auto" />
//               ) : (
//                 <FaVideo className="text-teal-600 mb-2 mx-auto" />
//               )}
//               {type === "inperson" ? "In-Person" : "Video Call"}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Date Picker */}
//       <div className="bg-white p-5 rounded-2xl shadow mt-6">
//         <h3 className="font-semibold mb-4">Select Appointment Date</h3>
//         <input
//           type="date"
//           min={today}
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="w-full border border-gray-300 p-3 rounded-xl"
//         />
//       </div>

//       {/* Time Picker */}
//       <div className="bg-white p-5 rounded-2xl shadow mt-6">
//         <h3 className="font-semibold mb-4 flex items-center gap-2">
//           <FaClock className="text-teal-600" />
//           Select Appointment Time
//         </h3>

//         <div className="grid grid-cols-3 gap-3">
//           {timeSlots.map((time) => (
//             <button
//               key={time}
//               onClick={() => setSelectedTime(time)}
//               className={`border rounded-xl py-2 text-sm ${
//                 selectedTime === time
//                   ? "bg-teal-600 text-white border-teal-600"
//                   : "border-gray-300"
//               }`}
//             >
//               {time}
//             </button>
//           ))}
//         </div>
//       </div>

//       {error && (
//         <p className="text-red-500 text-sm mt-4 text-center">
//           {error}
//         </p>
//       )}

//       {/* Confirm Button */}
//       <button
//         disabled={processing}
//         onClick={handleConfirmBooking}
//         className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl"
//       >
//         {processing ? "Processing..." : "Confirm Appointment"}
//       </button>
//     </div>
//   );
// };

// export default BookingPage;

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import axios from "axios";
import { FaStar, FaVideo, FaHospital, FaClock } from "react-icons/fa";

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [consultType, setConsultType] = useState("inperson");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // 🚨 If no doctor data
  if (!state) {
    return (
      <p className="text-center mt-10 text-red-500">
        No Booking Data Found
      </p>
    );
  }

  // 🚨 If not logged in
  if (!token) {
    navigate("/login");
    return null;
  }

  const fee = Number(state.fee || 800);
  const today = new Date().toISOString().split("T")[0];

  // ✅ Axios instance
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

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
  ];

  // ================= CONFIRM BOOKING =================
  const handleConfirmBooking = async () => {
    try {
      setError("");

      if (!selectedDate) throw new Error("Select appointment date");
      if (!selectedTime) throw new Error("Select appointment time");

      setProcessing(true);

      await API.post("/wallet/deduct", {
        amount: fee,
        category: "CONSULTATION",
        description: `Consultation - ${state.name}`,
        partnerName: state.hospital,
        doctorName: state.name,
        specialization: state.specialization,
        consultType,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
      });

      alert("Appointment Confirmed 🎉");
      navigate("/bookings", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Booking failed"
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-md mx-auto">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-600 mb-4"
      >
        ← Back
      </button>

      {/* Doctor Info */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <div className="flex gap-4">
          <div className="bg-teal-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold">
            {state.name.charAt(0)}
          </div>

          <div>
            <h2 className="font-semibold text-lg">{state.name}</h2>
            <p className="text-blue-600 text-sm">
              {state.specialization}
            </p>
            <p className="text-gray-500 text-xs">
              {state.hospital}
            </p>

            <div className="flex items-center gap-2 mt-1 text-sm">
              <FaStar className="text-yellow-400" />
              {state.rating || 4.5}
              <span className="text-gray-500">
                {state.experience || 15} yrs exp
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <p className="text-gray-600">Consultation Fee</p>
          <p className="text-teal-600 font-bold text-lg">₹{fee}</p>
        </div>
      </div>

      {/* Consultation Type */}
      <div className="bg-white p-5 rounded-2xl shadow mt-6">
        <h3 className="font-semibold mb-4">
          Consultation Type
        </h3>

        <div className="flex gap-4">
          {["inperson", "video"].map((type) => (
            <button
              key={type}
              onClick={() => setConsultType(type)}
              className={`flex-1 border rounded-xl p-4 text-center ${
                consultType === type
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200"
              }`}
            >
              {type === "inperson" ? (
                <FaHospital className="text-teal-600 mb-2 mx-auto" />
              ) : (
                <FaVideo className="text-teal-600 mb-2 mx-auto" />
              )}
              {type === "inperson"
                ? "In-Person"
                : "Video Call"}
            </button>
          ))}
        </div>
      </div>

      {/* Date Picker */}
      <div className="bg-white p-5 rounded-2xl shadow mt-6">
        <h3 className="font-semibold mb-4">
          Select Appointment Date
        </h3>
        <input
          type="date"
          min={today}
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
          className="w-full border border-gray-300 p-3 rounded-xl"
        />
      </div>

      {/* Time Picker */}
      <div className="bg-white p-5 rounded-2xl shadow mt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FaClock className="text-teal-600" />
          Select Appointment Time
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`border rounded-xl py-2 text-sm ${
                selectedTime === time
                  ? "bg-teal-600 text-white border-teal-600"
                  : "border-gray-300"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-4 text-center">
          {error}
        </p>
      )}

      {/* Confirm Button */}
      <button
        disabled={processing}
        onClick={handleConfirmBooking}
        className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl disabled:opacity-60"
      >
        {processing
          ? "Processing..."
          : "Confirm Appointment"}
      </button>
    </div>
  );
};

export default BookingPage;
