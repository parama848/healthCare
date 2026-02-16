import { NavLink } from "react-router-dom";
import { Home, FileText, MapPin, Wallet, User } from "lucide-react";

export default function BottomNav() {
  const navItem =
    "flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all duration-200";

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-2 py-2 z-50">
      <div className="flex justify-between items-center">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "text-teal-600"
                : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          <Home size={20} strokeWidth={2} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/records"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "text-teal-600"
                : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          <FileText size={20} strokeWidth={2} />
          <span>Records</span>
        </NavLink>

        <NavLink
          to="/find-care"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "text-teal-600"
                : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          <MapPin size={20} strokeWidth={2} />
          <span>Hospital</span>
        </NavLink>

        <NavLink
          to="/wallet"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "text-teal-600"
                : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          <Wallet size={20} strokeWidth={2} />
          <span>Wallet</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${navItem} ${
              isActive
                ? "text-teal-600"
                : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          <User size={20} strokeWidth={2} />
          <span>Profile</span>
        </NavLink>

      </div>
    </div>
  );
}
