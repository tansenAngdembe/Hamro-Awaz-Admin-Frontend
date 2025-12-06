import React, { useEffect, useState } from "react";
import { House, Menu, X } from "lucide-react";
import * as Icons from "lucide-react";
import SidebarItem from "./SidebarItem";
import api from "../../api/axios.js";
import SuccessAlert from "../alerts/SuccessAlert.jsx";
import ErrorAlert from "../alerts/ErrorAlert.jsx";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Sidebar = () => {
  const [navigations, setNavigations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {  checkAuth } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  const fetchNavigation = async () => {
    try {
      setLoading(true);
      const response = await api.get("/navigation");
      if (response.data.code == 200) {
        setNavigations(response.data.data);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch {
      setErrorMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
    const handleLogout = async () => {
    try {
      const response = await api.get("/logout");

      if (response.data.code === 200) {
        checkAuth();
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchNavigation();
  }, []);

  return (
    <div
      className={`
        h-screen bg-[#0C1F2A] text-white shadow-xl transition-all duration-300 
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {successMessage && <SuccessAlert message={successMessage} />}
      {errorMessage && <ErrorAlert message={errorMessage} />}

      {/* Top Section */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img
              src="/hamroAwazlogo.png"
              alt="HamroAwaz Logo"
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-lg font-bold tracking-wide">HamroAwaz</h1>
          </div>
        )}

        <button
          className="p-2 rounded-md hover:bg-white/10"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Dashboard */}
      <NavLink to="/" end>
        {({ isActive }) => (
          <SidebarItem
            icon={<House size={20} />}
            label="Dashboard"
            active={isActive}
            collapsed={collapsed}
          />
        )}
      </NavLink>

      {/* Title */}
      {!collapsed && (
        <div className="mt-5 mb-2 text-xs font-semibold text-gray-300 pl-5">
          APPLICATIONS
        </div>
      )}

      {/* Navigation Items */}
      <div className="mt-2">
        {loading ? (
          <p className="text-gray-400 pl-5">Loading...</p>
        ) : (
          <>
            {[...navigations]
              .sort((a, b) => a.position - b.position)
              .map((item, index) => {
                const IconComponent = Icons[item.icon] || Icons["Settings"];
                return (
                  <NavLink
                    to={item.navigation}
                    key={index}
                    className="block"
                    isActive={(_, location) =>
                      location.pathname.startsWith(item.navigation)
                    }
                  >
                    {({ isActive }) => (
                      <SidebarItem
                        icon={<IconComponent size={20} />}
                        label={item.name}
                        active={isActive}
                        collapsed={collapsed}
                      />
                    )}
                  </NavLink>
                );
              })}

            <div className="absolute bottom-5 left-5 w-[85%] hidden lg:block">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg 
                       text-red-600 hover:bg-red-50 font-medium cursor-pointer"
              >
                <Icons.LogOut size={20} />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
