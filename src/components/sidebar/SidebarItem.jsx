import { LogOut } from "lucide-react";
import React from "react";

const SidebarItem = ({ icon, label, active, collapsed }) => {
  return (
    <div
      className={`
        group flex items-center gap-3 mx-2 px-3 py-3 my-1 rounded-lg cursor-pointer transition
        ${active ? "bg-[#1F8A3A] text-white" : "text-gray-300 hover:bg-white/10"}
      `}
    >
      <div className="text-white">{icon}</div>

      {!collapsed && <span className="font-medium">{label}</span>}

      {collapsed && (
        <span
          className="
            absolute left-20 bg-black text-white text-sm 
            px-2 py-1 rounded opacity-0 group-hover:opacity-100 
            transition whitespace-nowrap z-50
          "
        >
          {label}
        </span>
      )}

      
    </div>
  );
};

export default SidebarItem;
