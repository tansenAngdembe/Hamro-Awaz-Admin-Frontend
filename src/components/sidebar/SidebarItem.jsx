import { LogOut } from "lucide-react";
import React from "react";

const SidebarItem = ({ icon, label, active, collapsed }) => {
  return (
    <div
      className={`
        group flex items-center gap-2 mx-2 px-1 py-2 my-1 rounded-lg cursor-pointer transition
        ${active ? "bg-secondary text-bgPrimary" : "text-gray-300 hover:bg-white/10"}
      `}
    >
      <div className="text-white">{icon}</div>

      {!collapsed && <span className="font-medium">{label}</span>}

      {collapsed && (
        <span
          className="
            absolute left-20 bg-black text-white text-sm 
            px-1 py-1 rounded opacity-0 group-hover:opacity-100 
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
