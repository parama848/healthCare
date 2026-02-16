import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaFileMedical,
  FaDownload,
  FaTrash,
  FaShareAlt,
  FaUpload,
  FaEdit,
  FaPlus
} from "react-icons/fa";

const RecordsPage = () => {
  const token = localStorage.getItem("token");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const API = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:5000/api",
    });

    instance.interceptors.request.use((req) => {
      if (token) req.headers.Authorization = `Bearer ${token}`;
      return req;
    });

    return instance;
  }, [token]);

  // ================= FETCH RECORDS =================
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await API.get("/medical-records");
      setRecords(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ================= UPLOAD =================
  const handleUpload = async () => {
    if (!title || !file) {
      alert("Please enter title and select file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      await API.post("/medical-records", formData);
      alert("Record uploaded successfully");
      setShowUpload(false);
      setTitle("");
      setFile(null);
      fetchRecords();
    } catch (err) {
      alert("Upload failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      await API.delete(`/medical-records/${id}`);
      fetchRecords();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = (id) => {
    window.open(
      `http://localhost:5000/api/medical-records/download/${id}`,
      "_blank"
    );
  };

  // ================= SHARE =================
  const handleShare = async (id) => {
    try {
      const res = await API.post(
        `/medical-records/share/${id}`
      );

      const link = `${window.location.origin}/share/${res.data.token}`;
      navigator.clipboard.writeText(link);

      alert("Share link copied to clipboard!");
    } catch (err) {
      alert("Share failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading records...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            Medical Records
          </h1>

          <button
            onClick={() => setShowUpload(true)}
            className="bg-teal-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <FaPlus /> Add
          </button>
        </div>

        {/* RECORD LIST */}
        {records.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No records uploaded yet.
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record._id}
              className="bg-white p-4 rounded-xl shadow mb-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <FaFileMedical className="text-teal-600 mt-1" />
                  <div>
                    <h3 className="text-sm font-semibold">
                      {record.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        record.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between mt-4 text-sm">
                <button
                  onClick={() =>
                    handleDownload(record._id)
                  }
                  className="flex items-center gap-1 text-blue-600"
                >
                  <FaDownload /> Download
                </button>

                <button
                  onClick={() =>
                    handleShare(record._id)
                  }
                  className="flex items-center gap-1 text-green-600"
                >
                  <FaShareAlt /> Share
                </button>

                <button
                  onClick={() =>
                    handleDelete(record._id)
                  }
                  className="flex items-center gap-1 text-red-500"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {/* UPLOAD MODAL */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80">
              <h2 className="text-lg font-semibold mb-4">
                Upload Record
              </h2>

              <input
                type="text"
                placeholder="Record title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full border p-2 rounded mb-3"
              />

              <input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
                className="w-full mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setShowUpload(false)
                  }
                  className="border px-3 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  className="bg-teal-600 text-white px-3 py-1 rounded"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RecordsPage;
