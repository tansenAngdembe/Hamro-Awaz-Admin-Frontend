import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, Settings } from "lucide-react";
import ProfileMenu from "../menus/ProfileMenu";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Alert from "../alerts/Alert";
import { useAuth } from "../../context/AuthContext";

const DUMMY_DATA = [
  { id: 1, name: "Admin User", type: "User" },
  { id: 2, name: "Ward No. 7 Report", type: "Report" },
  { id: 3, name: "Citizen Complaint", type: "Complaint" },
  { id: 4, name: "Municipality Event", type: "Event" },
  { id: 5, name: "Payment Verification", type: "Finance" },
];

const Header = ({ profile }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);

  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  // Dummy API Search
  const handleSearch = async (text) => {
    setQuery(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      const filtered = DUMMY_DATA.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
      setShowResults(true);
    }, 300);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    api
      .get("/logout")
      .then((response) => {
        if (response.data.code === 200) {
          checkAuth();
          return <Navigate to="/login" />;
        }
      })
      .catch(() => console.error("Something went wrong on server"));
  };

  return (
    <nav className="hidden lg:flex w-full bg-gray-50 px-6 py-4 items-center justify-end shadow-sm border-b">
      {/* LEFT SIDE */}
      {/* <div className="flex items-center gap-6">
        <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition" />

        <div className="flex items-center bg-white rounded-full px-3 py-1 text-sm shadow cursor-pointer text-gray-600 border">
          NP <ChevronDown className="w-4 h-4 ml-1" />
        </div>
      </div> */}

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {/* SEARCH FIELD WITH DROPDOWN */}
        <div className="relative w-64" ref={searchRef}>
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full py-2 pl-4 pr-10 rounded-full text-sm text-gray-700 bg-white shadow outline-none border border-gray-300 placeholder-gray-400"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />

          {/* Dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute mt-2 w-full bg-white shadow-lg border rounded-lg z-50 max-h-60 overflow-auto">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-500">{item.type}</span>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {showResults && results.length === 0 && query.trim() !== "" && (
            <div className="absolute mt-2 w-full bg-white shadow border rounded-lg p-3 text-center text-sm text-gray-500">
              No results found
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
         
          <span>
            {(() => {
              const hour = new Date().getHours();
              let greeting = "Hello";

              if (hour >= 5 && hour < 12) greeting = "Good Morning";
              else if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
              else if (hour >= 17 && hour < 21) greeting = "Good Evening";
              else greeting = "Good Night";

              return (
                <>
                  {greeting},{" "}
                  <span className="text-black font-medium">{profile?.name}</span>
                </>
              );
            })()}
          </span>


          <ProfileMenu
            items={[
              { label: "View Profile", onClick: () => navigate("/view/profile") },
              { label: "Change Password", onClick: () => navigate("/changePassword") },
              { label: "Activity Log", onClick: () => navigate("/activity-log") },
              { label: "Log out", onClick: handleLogout },
            ]}
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
