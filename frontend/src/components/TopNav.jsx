import React from "react";
import { Bell } from "lucide-react";

export default function TopNav() {
  return (
    <div className="fixed top-0 w-[375px] bg-white border-b z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 text-white w-8 h-8 flex items-center justify-center rounded-md font-bold">
            C
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wide">
              CORECARE
            </h1>
            <p className="text-[10px] text-gray-500">HEALTH OS</p>
          </div>
        </div>

        <Bell size={20} className="text-gray-600" />
      </div>
    </div>
  );
}
