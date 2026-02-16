import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaDownload,
  FaTrash,
  FaShareAlt,
  FaEdit,
} from "react-icons/fa";

const UploadRecord = () => {
  const API = "http://localhost:5000/api/medical-records";
  const token = localStorage.getItem("token");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    doctorName: "",
    hospitalName: "",
    recordDate: "",
    status: "Normal",
    tags: "",
  });

  // ================= FETCH =================
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ================= EDIT =================
  const handleEdit = (record) => {
    setEditingId(record._id);

    setForm({
      name: record.name || "",
      description: record.description || "",
      category: record.category || "",
      doctorName: record.doctor?.name || "",
      hospitalName: record.hospital?.name || "",
      recordDate: record.recordDate
        ? record.recordDate.split("T")[0]
        : "",
      status: record.status || "Normal",
      tags: record.tags?.join(",") || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setFile(null);
    setForm({
      name: "",
      description: "",
      category: "",
      doctorName: "",
      hospitalName: "",
      recordDate: "",
      status: "Normal",
      tags: "",
    });
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (editingId) {
        await axios.put(`${API}/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const formData = new FormData();
        Object.keys(form).forEach((key) =>
          formData.append(key, form[key])
        );
        if (file) formData.append("file", file);

        await axios.post(API, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchRecords();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchRecords();
  };

  // ================= DOWNLOAD =================
  const handleDownload = async (id) => {
    const response = await axios.get(`${API}/download/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const fileName =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/"/g, "") || "file";

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // ================= SHARE =================
  const handleShare = async (id) => {
    const { data } = await axios.post(
      `${API}/share/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigator.clipboard.writeText(data.shareLink);
    alert("Share link copied!");
  };

  const getStatusColor = (status) => {
    if (status === "Critical")
      return "bg-red-100 text-red-600";
    if (status === "Attention Needed")
      return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 overflow-x-hidden">
      <div className="w-full max-w-md mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-8 text-center">
          Medical Record Manager
        </h1>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 w-full">
          <h2 className="text-lg font-semibold mb-6 text-center">
            {editingId ? "Update Record" : "Upload New Record"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              name="name"
              placeholder="name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded-xl w-full"
            />

            <input
              name="doctorName"
              placeholder="Doctor Name"
              value={form.doctorName}
              onChange={handleChange}
              className="border p-3 rounded-xl w-full"
            />

            <input
              name="hospitalName"
              placeholder="Hospital Name"
              value={form.hospitalName}
              onChange={handleChange}
              className="border p-3 rounded-xl w-full"
            />

            <input
              type="date"
              name="recordDate"
              value={form.recordDate}
              onChange={handleChange}
              className="border p-3 rounded-xl w-full"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border p-3 rounded-xl w-full"
            >
              <option value="">Select Category</option>
              <option value="Lab Report">Lab Report</option>
              <option value="Prescription">Prescription</option>
              <option value="Imaging">Imaging</option>
            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-3 rounded-xl w-full"
            >
              <option value="Normal">Normal</option>
              <option value="Attention Needed">Attention Needed</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-3 rounded-xl w-full mt-4"
          />

          {!editingId && (
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="mt-4 w-full"
            />
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className={`py-3 rounded-xl text-white ${
                editingId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {editingId ? "Update Record" : "Upload Record"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="py-3 rounded-xl bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* RECORD LIST */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="space-y-6">
           {records.map((rec) => (
  <div
    key={rec._id}
    className="bg-white rounded-2xl shadow-md p-5 border border-gray-100"
  >
    {/* Header */}
    <div className="flex justify-between items-start gap-3">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          {rec.name}
        </h3>

        {rec.description && (
          <p className="text-gray-500 text-sm mt-1">
            {rec.description}
          </p>
        )}
      </div>

      <span
        className={`text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(
          rec.status
        )}`}
      >
        {rec.status}
      </span>
    </div>

    {/* Info Section */}
    <div className="mt-4 space-y-2 text-sm">
      {rec.doctor?.name && (
        <div className="flex justify-between">
          <span className="text-gray-400">Doctor</span>
          <span className="font-medium text-gray-800">
            {rec.doctor.name}
          </span>
        </div>
      )}

      {rec.hospital?.name && (
        <div className="flex justify-between">
          <span className="text-gray-400">Hospital</span>
          <span className="font-medium text-gray-800">
            {rec.hospital.name}
          </span>
        </div>
      )}

      {rec.recordDate && (
        <div className="flex justify-between">
          <span className="text-gray-400">Date</span>
          <span className="font-medium text-gray-800">
            {new Date(rec.recordDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>

    {/* Divider */}
    <div className="border-t border-gray-100 my-4"></div>

    {/* Actions */}
    <div className="flex flex-wrap justify-between gap-y-3 text-sm font-medium">
      <button
        onClick={() => handleEdit(rec)}
        className="flex items-center gap-1 text-blue-600"
      >
        <FaEdit size={14} /> Edit
      </button>

      <button
        onClick={() => handleDownload(rec._id)}
        className="flex items-center gap-1 text-green-600"
      >
        <FaDownload size={14} /> Download
      </button>

      <button
        onClick={() => handleShare(rec._id)}
        className="flex items-center gap-1 text-purple-600"
      >
        <FaShareAlt size={14} /> Share
      </button>

      <button
        onClick={() => handleDelete(rec._id)}
        className="flex items-center gap-1 text-red-500"
      >
        <FaTrash size={14} /> Delete
      </button>
    </div>
  </div>
))}

          </div>
        )}
      </div>
    </div>
  );
};

export default UploadRecord;
