import { ArrowLeft, Check, Eye, EyeOff, Move, MoveLeft, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Alert from "../../components/alerts/Alert";
import IconCard from "../../components/iconcard/IconCard";
import Loader from "../../components/loader/Loader";

const SettingPage = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingsList, setSettingsList] = useState([
    {
      "name": "Advertisement",
      "description": "Advertisement ",
      "uiGroupName": "Settings",
      "navigation": "/advertisement",
      "parentName": "Settings",
      "icon": "RiAdvertisementFill",
      "position": 6,
      "childRoles": [],
      "permission": "ACCESS_GROUPS"
    }
  ]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchSettingsList = () => {
    setLoading(true);

    api.get("/navigation")
      .then((response) => {
        if (response.data.code == 200) {
          const navigationData = response.data.data;

          const settingsGroup = navigationData.find(
            (group) => group.uiGroupName === "Settings"
          );

          if (settingsGroup) {
            const uniqueRoles = Array.from(
              new Set(settingsGroup.roles.map((role) => role.name))
            ).map((name) =>
              settingsGroup.roles.find((role) => role.name === name)
            );

            // Merge: initial + API unique roles
            setSettingsList((prev) => {
              const newItems = uniqueRoles.filter(
                (apiItem) => !prev.some((p) => p.name === apiItem.name)
              );
              return [...prev, ...newItems];
            });
          }
        }
      })
      .catch(() => {
        setErrorMessage("Failed to load settings");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  useEffect(() => {
    fetchSettingsList();
  }, []);
  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-2">
          <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
          <h2 className="text-xl font-semibold">SETTINGS</h2>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200 mb-4"></div>
      {loading ? (
        <Loader />
      ) : (
        <main className="max-w-7xl ">
          <div className="flex flex-wrap gap-6">
            {settingsList.map((setting, index) => (
              <IconCard
                key={index}
                iconName={setting.icon}
                text={setting.name}
                link={`/setting${setting.navigation}`}
              />
            ))}
          </div>
        </main>
      )}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          duration={1000}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {errorMessage && (
        <Alert
          type="error"
          message={errorMessage}
          duration={1000}
          onClose={() => setErrorMessage("")}
        />
      )}
    </div>
  );
};
export default SettingPage;
