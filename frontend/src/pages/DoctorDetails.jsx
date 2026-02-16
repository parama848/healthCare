import { useLocation, useNavigate } from "react-router-dom";

const DoctorDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No Doctor Data</p>;

  return (
    <div className="p-6 max-w-md mx-auto">

      <button onClick={() => navigate(-1)}>← Back</button>

      <div className="bg-white p-5 rounded-xl shadow mt-4">
        <h2 className="text-lg font-semibold">{state.name}</h2>
        <p className="text-blue-600">{state.specialization}</p>
        <p className="text-gray-500">{state.hospital}</p>

        <div className="mt-2 text-sm">
          ⭐ {state.rating} | {Math.floor(Math.random() * 20)} yrs exp
        </div>

        <div className="mt-3 flex gap-2 text-xs">
          <span className="bg-gray-100 px-2 py-1 rounded">MBBS</span>
          <span className="bg-gray-100 px-2 py-1 rounded">MD</span>
          <span className="bg-gray-100 px-2 py-1 rounded">DM</span>
        </div>

        <div className="mt-5 text-right text-xl font-bold">
          ₹{Math.floor(Math.random() * 500 + 500)}
        </div>
      </div>

      <button
        className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg"
        onClick={() =>
          navigate(`/booking/${state.id}`, { state })
        }
      >
        Continue Booking
      </button>
    </div>
  );
};

export default DoctorDetails;
