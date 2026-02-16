// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaPlus } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const Wallet = () => {
//   const userId = "6990b964a6a695c1ad0916fc";

//   const [wallet, setWallet] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [breakdown, setBreakdown] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showAddModal, setShowAddModal] = useState(false);
//   const [amount, setAmount] = useState("");
//   const [processing, setProcessing] = useState(false);

//   // ================= FETCH DATA =================
//   const fetchData = async () => {
//     try {
//       const [walletRes, txnRes, breakdownRes] = await Promise.all([
//         axios.get(`http://localhost:5000/api/wallet/${userId}`),
//         axios.get(`http://localhost:5000/api/wallet/transactions/${userId}`),
//         axios.get(`http://localhost:5000/api/wallet/breakdown/${userId}`)
//       ]);

//       setWallet(walletRes.data);
//       setTransactions(Array.isArray(txnRes.data) ? txnRes.data : []);
//       setBreakdown(Array.isArray(breakdownRes.data) ? breakdownRes.data : []);

//     } catch (error) {
//       console.error("Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial load + auto refresh when returning to page
//   useEffect(() => {
//     fetchData();

//     const handleFocus = () => {
//       fetchData();
//     };

//     window.addEventListener("focus", handleFocus);

//     return () => {
//       window.removeEventListener("focus", handleFocus);
//     };
//   }, []);

//   // ================= STRIPE TOP-UP =================
//   const handleAddMoney = async () => {
//     if (!amount || amount <= 0) {
//       alert("Enter valid amount");
//       return;
//     }

//     try {
//       setProcessing(true);

//       const res = await axios.post(
//         "http://localhost:5000/api/payment/create-checkout-session",
//         {
//           amount: Number(amount),
//           userId
//         }
//       );

//       window.location.href = res.data.url;

//     } catch (err) {
//       console.error(err);
//       alert("Stripe payment initiation failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // ================= DOCTOR BOOKING (Wallet Payment) =================
//   const handleDoctorBooking = async () => {
//     try {
//       setProcessing(true);

//       await axios.post(
//         `http://localhost:5000/api/wallet/deduct/${userId}`,
//         {
//           amount: 500,
//           category: "CONSULTATION",
//           description: "Consultation - Dr. Sharma",
//           partnerName: "Apollo Hospital"
//         }
//       );

//       alert("Doctor booked successfully using wallet!");
//       fetchData();

//     } catch (err) {
//       alert(err.response?.data?.message || "Booking failed");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading)
//     return <div className="text-center mt-10">Loading...</div>;

//   if (!wallet)
//     return <div className="text-center mt-10">No Wallet Found</div>;

//   const currentMonth = new Date().getMonth();

//   const monthlyCredit = transactions
//     .filter(
//       (txn) =>
//         txn.type === "CREDIT" &&
//         new Date(txn.createdAt).getMonth() === currentMonth
//     )
//     .reduce((acc, curr) => acc + curr.amount, 0);

//   const monthlyDebit = transactions
//     .filter(
//       (txn) =>
//         txn.type === "DEBIT" &&
//         new Date(txn.createdAt).getMonth() === currentMonth
//     )
//     .reduce((acc, curr) => acc + curr.amount, 0);

//   const maxValue =
//     breakdown.length > 0
//       ? Math.max(...breakdown.map((item) => item.total))
//       : 1;

//   return (
//     <div className="min-h-screen mt-10 bg-gray-100 flex justify-center">
//       <div className="w-full max-w-md px-4 py-6">

//         {/* HEADER */}
//         <h1 className="text-xl font-semibold">Medical Savings</h1>
//         <p className="text-gray-500 text-sm mb-6">
//           Your healthcare-dedicated wallet
//         </p>

//         {/* WALLET CARD */}
//         <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-2xl p-6 shadow-md mb-6">
//           <p className="text-xs opacity-80">Medical Wallet Balance</p>
//           <h2 className="text-2xl font-bold mt-1">
//             ₹{wallet.balance?.toLocaleString()}
//           </h2>

//           <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
//             <div className="bg-teal-500/60 p-3 rounded-xl">
//               <p className="text-xs opacity-80">Total Deposited</p>
//               <h3 className="font-semibold mt-1">
//                 ₹{wallet.totalDeposited?.toLocaleString()}
//               </h3>
//             </div>
//             <div className="bg-teal-500/60 p-3 rounded-xl">
//               <p className="text-xs opacity-80">Total Used</p>
//               <h3 className="font-semibold mt-1">
//                 ₹{wallet.totalUsed?.toLocaleString()}
//               </h3>
//             </div>
//           </div>

//           <button
//             onClick={() => setShowAddModal(true)}
//             className="mt-5 w-full bg-white text-teal-600 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
//           >
//             <FaPlus /> Add Money
//           </button>

//            <Link to="/find-care">
//           <button
//             // onClick={handleDoctorBooking}
//             disabled={processing}
//             className="mt-3 w-full bg-red-500 text-white py-2 rounded-xl text-sm"
//           >
//             Book Doctor
//           </button>
//            </Link>
//         </div>

//         {/* MONTHLY SUMMARY */}
//         <div className="grid grid-cols-2 gap-3 mb-6">
//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <p className="text-xs text-gray-500">This Month</p>
//             <h3 className="text-green-600 font-semibold mt-1">
//               +₹{monthlyCredit.toLocaleString()}
//             </h3>
//           </div>

//           <div className="bg-white p-4 rounded-xl shadow-sm">
//             <p className="text-xs text-gray-500">This Month</p>
//             <h3 className="text-red-500 font-semibold mt-1">
//               -₹{monthlyDebit.toLocaleString()}
//             </h3>
//           </div>
//         </div>

//         {/* BREAKDOWN */}
//         <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
//           <h2 className="text-sm font-semibold mb-4">
//             Usage Breakdown
//           </h2>

//           {breakdown.map((item) => (
//             <div key={item._id} className="mb-3">
//               <div className="flex justify-between text-xs mb-1">
//                 <span>{item._id}</span>
//                 <span>₹{item.total}</span>
//               </div>

//               <div className="h-2 bg-gray-200 rounded-full">
//                 <div
//                   className="h-2 bg-teal-500 rounded-full"
//                   style={{
//                     width: `${(item.total / maxValue) * 100}%`
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* TRANSACTIONS */}
//         <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
//           <h2 className="text-sm font-semibold mb-4">
//             Recent Transactions
//           </h2>

//           {transactions.slice(0, 5).map((txn) => (
//             <div
//               key={txn._id}
//               className="flex justify-between py-3 border-b last:border-none"
//             >
//               <div>
//                 <p className="text-sm font-medium">
//                   {txn.description}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(txn.createdAt).toLocaleDateString()}
//                 </p>
//               </div>

//               <p
//                 className={`text-sm font-semibold ${
//                   txn.type === "CREDIT"
//                     ? "text-green-600"
//                     : "text-red-500"
//                 }`}
//               >
//                 {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* ADD MONEY MODAL */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-xl w-80">
//               <h2 className="text-lg font-semibold mb-4">
//                 Add Money
//               </h2>

//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 placeholder="Enter amount"
//                 className="w-full border p-2 rounded mb-4"
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   className="px-3 py-1 border rounded"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   disabled={processing}
//                   onClick={handleAddMoney}
//                   className="px-3 py-1 bg-teal-600 text-white rounded"
//                 >
//                   Pay
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default Wallet;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Wallet = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  // 🚨 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Axios instance with token
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

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const [walletRes, txnRes, breakdownRes] =
        await Promise.all([
          API.get("/wallet"),
          API.get("/wallet/transactions"),
          API.get("/wallet/breakdown"),
        ]);

      setWallet(walletRes.data);
      setTransactions(
        Array.isArray(txnRes.data) ? txnRes.data : []
      );
      setBreakdown(
        Array.isArray(breakdownRes.data)
          ? breakdownRes.data
          : []
      );

    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + auto refresh
  useEffect(() => {
    fetchData();

    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // ================= ADD MONEY =================
  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setProcessing(true);

      await API.post("/wallet/add", {
        amount: Number(amount),
      });

      alert("Money added successfully!");
      setShowAddModal(false);
      setAmount("");
      fetchData();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to add money"
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10">Loading...</div>
    );

  if (!wallet)
    return (
      <div className="text-center mt-10">
        No Wallet Found
      </div>
    );

  const currentMonth = new Date().getMonth();

  const monthlyCredit = transactions
    .filter(
      (txn) =>
        txn.type === "CREDIT" &&
        new Date(txn.createdAt).getMonth() ===
          currentMonth
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthlyDebit = transactions
    .filter(
      (txn) =>
        txn.type === "DEBIT" &&
        new Date(txn.createdAt).getMonth() ===
          currentMonth
    )
    .reduce((acc, curr) => acc + curr.amount, 0);

  const maxValue =
    breakdown.length > 0
      ? Math.max(...breakdown.map((item) => item.total))
      : 1;

  return (
    <div className="min-h-screen mt-10 bg-gray-100 flex justify-center">
      <div className="w-full max-w-md px-4 py-6">

        {/* HEADER */}
        <h1 className="text-xl font-semibold">
          Medical Savings
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Your healthcare-dedicated wallet
        </p>

        {/* WALLET CARD */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-2xl p-6 shadow-md mb-6">
          <p className="text-xs opacity-80">
            Medical Wallet Balance
          </p>
          <h2 className="text-2xl font-bold mt-1">
            ₹{wallet.balance?.toLocaleString()}
          </h2>

          <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
            <div className="bg-teal-500/60 p-3 rounded-xl">
              <p className="text-xs opacity-80">
                Total Deposited
              </p>
              <h3 className="font-semibold mt-1">
                ₹
                {wallet.totalDeposited?.toLocaleString()}
              </h3>
            </div>
            <div className="bg-teal-500/60 p-3 rounded-xl">
              <p className="text-xs opacity-80">
                Total Used
              </p>
              <h3 className="font-semibold mt-1">
                ₹{wallet.totalUsed?.toLocaleString()}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-5 w-full bg-white text-teal-600 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
          >
            <FaPlus /> Add Money
          </button>

          <Link to="/find-care">
            <button className="mt-3 w-full bg-red-500 text-white py-2 rounded-xl text-sm">
              Book Doctor
            </button>
          </Link>
        </div>

        {/* MONTHLY SUMMARY */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500">
              This Month Credit
            </p>
            <h3 className="text-green-600 font-semibold mt-1">
              +₹{monthlyCredit.toLocaleString()}
            </h3>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500">
              This Month Debit
            </p>
            <h3 className="text-red-500 font-semibold mt-1">
              -₹{monthlyDebit.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-sm font-semibold mb-4">
            Usage Breakdown
          </h2>

          {breakdown.map((item) => (
            <div key={item._id} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>{item._id}</span>
                <span>₹{item.total}</span>
              </div>

              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-teal-500 rounded-full"
                  style={{
                    width: `${
                      (item.total / maxValue) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h2 className="text-sm font-semibold mb-4">
            Recent Transactions
          </h2>

          {transactions.slice(0, 5).map((txn) => (
            <div
              key={txn._id}
              className="flex justify-between py-3 border-b last:border-none"
            >
              <div>
                <p className="text-sm font-medium">
                  {txn.description}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(
                    txn.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <p
                className={`text-sm font-semibold ${
                  txn.type === "CREDIT"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {txn.type === "CREDIT"
                  ? "+"
                  : "-"}
                ₹{txn.amount}
              </p>
            </div>
          ))}
        </div>

        {/* ADD MONEY MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80">
              <h2 className="text-lg font-semibold mb-4">
                Add Money
              </h2>

              <input
                type="number"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                placeholder="Enter amount"
                className="w-full border p-2 rounded mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>

                <button
                  disabled={processing}
                  onClick={handleAddMoney}
                  className="px-3 py-1 bg-teal-600 text-white rounded"
                >
                  {processing
                    ? "Processing..."
                    : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Wallet;
