import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSearch, FaFileMedical } from "react-icons/fa";

const Records = () => {
  const API = "http://localhost:5000/api/medical-records";
  const token = localStorage.getItem("token");

  const [rawRecords, setRawRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort by date descending
      const sorted = data.sort(
        (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
      );

      setRawRecords(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ================= FILTER + GROUP =================
  const groupedRecords = useMemo(() => {
    const filtered = rawRecords.filter((r) =>
      r.name?.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = filtered.reduce((acc, record) => {
      const month = new Date(record.recordDate).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!acc[month]) acc[month] = [];
      acc[month].push(record);

      return acc;
    }, {});

    return Object.keys(grouped).map((month) => ({
      month,
      items: grouped[month],
    }));
  }, [rawRecords, search]);

  // ================= BADGE COLORS =================
  const categoryColors = {
    "Lab Report": "bg-blue-100 text-blue-600",
    Prescription: "bg-teal-100 text-teal-600",
    Imaging: "bg-orange-100 text-orange-600",
    Diagnosis: "bg-red-100 text-red-600",
    "Visit Summary": "bg-yellow-100 text-yellow-600",
  };

  const statusColors = {
    Normal: "bg-green-100 text-green-600",
    "Attention Needed": "bg-yellow-100 text-yellow-600",
    Critical: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 overflow-x-hidden">
      <div className="w-full max-w-3xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-8">
          Health Timeline
        </h1>

        {/* SEARCH */}
        <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm mb-8">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            className="w-full outline-none text-sm"
            placeholder="Search records by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading records...
          </p>
        )}

        {/* EMPTY STATE */}
        {!loading && groupedRecords.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <FaFileMedical className="text-4xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No medical records found.
            </p>
          </div>
        )}

        {/* TIMELINE */}
        {!loading &&
          groupedRecords.map((group) => (
            <div key={group.month} className="mb-10">

              {/* MONTH TITLE */}
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-teal-600 rounded-full mr-3"></div>
                <h2 className="font-semibold text-gray-600 text-lg">
                  {group.month}
                </h2>
              </div>

              {/* RECORDS */}
              <div className="space-y-6 border-l-2 border-gray-200 ml-2 pl-6">
                {group.items.map((record) => (
                  <div
                    key={record._id}
                    className="bg-white rounded-2xl shadow-sm p-6 relative"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-8 top-6 w-4 h-4 bg-teal-600 rounded-full"></div>

                    <div className="flex justify-between items-start">

                      <div className="w-full pr-4">
                        <h3 className="text-lg font-semibold break-words">
                          {record.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 break-words">
                          {record.description}
                        </p>

                        <p className="text-xs text-gray-400 mt-3">
                          Dr. {record.doctor?.name || "—"} •{" "}
                          {record.hospital?.name || "—"}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(record.recordDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {/* CATEGORY BADGE */}
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            categoryColors[record.category] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {record.category}
                        </span>

                        {/* STATUS BADGE */}
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            statusColors[record.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </div>

                    {/* TAGS */}
                    {record.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {record.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Records;
