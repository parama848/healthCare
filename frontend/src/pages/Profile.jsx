import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Pencil,
  Heart,
  Phone,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(data);
    };
    fetchProfile();
  }, [token]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE ARRAY ================= */
  const handleArrayAdd = (field) => {
    const value = prompt(`Enter ${field}`);
    if (!value) return;
    setUser({
      ...user,
      [field]: [...(user[field] || []), value]
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    const { data } = await axios.put(
      "http://localhost:5000/api/users/profile",
      user,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setUser(data);
    setEdit(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth", { replace: true });
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="space-y-6 pb-10 mt-10">

      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-2xl p-5 shadow-md relative">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
            {user.name?.charAt(0)}
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              {edit ? (
                <input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="bg-transparent border-b outline-none"
                />
              ) : (
                user.name
              )}
            </h2>
            <p className="text-xs opacity-80">{user.email}</p>

            <div className="flex gap-2 mt-2 text-[10px]">
              {user.bloodGroup && (
                <span className="bg-white/20 px-2 py-1 rounded-full">
                  {user.bloodGroup}
                </span>
              )}
              {user.age && (
                <span className="bg-white/20 px-2 py-1 rounded-full">
                  {user.age} yrs
                </span>
              )}
            </div>
          </div>
        </div>

        <Pencil
          size={16}
          className="absolute top-4 right-4 cursor-pointer"
          onClick={() => setEdit(!edit)}
        />
      </div>

      {/* PERSONAL INFO */}
      <Card title="Personal Information">
        <InfoRow label="Date of Birth" name="dateOfBirth" value={user.dateOfBirth} edit={edit} onChange={handleChange}/>
        <InfoRow label="Age" name="age" value={user.age} edit={edit} onChange={handleChange}/>
        <InfoRow label="Gender" name="gender" value={user.gender} edit={edit} onChange={handleChange}/>
        <InfoRow label="Blood Group" name="bloodGroup" value={user.bloodGroup} edit={edit} onChange={handleChange}/>
        <InfoRow label="Phone" name="phone" value={user.phone} edit={edit} onChange={handleChange}/>
        <InfoRow label="Email" name="email" value={user.email} edit={false}/>
      </Card>

      {/* MEDICAL INFO */}
      <Card title="Medical Information" icon={<Heart size={14} className="text-red-500"/>}>
        <Section label="Allergies" field="allergies" user={user} edit={edit} handleArrayAdd={handleArrayAdd}/>
        <Section label="Chronic Conditions" field="chronicConditions" user={user} edit={edit} handleArrayAdd={handleArrayAdd}/>
      </Card>

      {/* EMERGENCY */}
      <Card title="Emergency Contact" icon={<Phone size={14} className="text-green-600"/>}>
        {edit ? (
          <>
            <input
              name="emergencyName"
              placeholder="Name"
              value={user.emergencyContact?.name || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  emergencyContact: {
                    ...user.emergencyContact,
                    name: e.target.value
                  }
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              name="emergencyPhone"
              placeholder="Phone"
              value={user.emergencyContact?.phone || ""}
              onChange={(e) =>
                setUser({
                  ...user,
                  emergencyContact: {
                    ...user.emergencyContact,
                    phone: e.target.value
                  }
                })
              }
              className="border p-2 rounded w-full"
            />
          </>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-medium text-sm">
              {user.emergencyContact?.name}
            </p>
            <p className="text-sm text-green-700">
              {user.emergencyContact?.phone}
            </p>
          </div>
        )}
      </Card>

      {edit && (
        <button
          onClick={handleSave}
          className="w-full bg-teal-600 text-white py-3 rounded-xl"
        >
          Save Changes
        </button>
      )}

      <button
        onClick={handleLogout}
        className="w-full border border-red-400 text-red-500 py-3 rounded-xl"
      >
        <LogOut size={16} className="inline mr-2"/>
        Sign Out
      </button>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Card({ title, children, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-4">
      <div className="flex items-center gap-2 font-medium text-sm">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, name, value, edit, onChange }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b last:border-none">
      <span className="text-gray-500">{label}</span>
      {edit ? (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          className="border px-2 py-1 rounded text-sm"
        />
      ) : (
        <span className="font-medium">{value || "-"}</span>
      )}
    </div>
  );
}

function Section({ label, field, user, edit, handleArrayAdd }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{label}</span>
        {edit && (
          <button
            onClick={() => handleArrayAdd(field)}
            className="text-teal-600"
          >
            + Add
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {user[field]?.map((item, i) => (
          <span
            key={i}
            className="bg-gray-100 text-xs px-3 py-1 rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
