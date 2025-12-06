import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import api from "../../../api/axios";

const AccessGroupView = () => {
  const { uniqueId } = useParams();

  const [accessGroup, setAccessGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchServiceDetails = () => {
    setLoading(true);
    api
      .post("/accessGroup/view", {
        id: parseInt(uniqueId)
      })
      .then((response) => {
        if (response.data.code === 200) {
          setAccessGroup(response.data.data);
          setSuccessMessage(response.data.message);
        } else {
          setErrorMessage(response.data.message);
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage("Something went wrong on server");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchServiceDetails();
  }, []);

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  // Group roles by UI group
  const groupedRoles = accessGroup?.accessGroupRoleMaps?.reduce((acc, roleMap) => {
    const groupName = roleMap.adminRole.uiGroupName || "Other";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(roleMap);
    return acc;
  }, {}) || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading access group details...</p>
        </div>
      </div>
    );
  }

  if (errorMessage && !accessGroup) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!accessGroup) {
    return null;
  }

  return (
    <div className="p-2 space-y-6 mx-auto bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {accessGroup.name}
              </h1>
            </div>

            <p className="text-gray-600 mb-3">{accessGroup.description}</p>

            {accessGroup.remarks && (
              <div className="bg-blue-50 border-l-4 border-green-500 p-4 mb-3">
                <p className="text-sm font-medium text-green-900">Remarks</p>
                <p className="text-green-800">{accessGroup.remarks}</p>
              </div>
            )}
          </div>

          <div className="ml-4">
            <span
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: accessGroup.status.color + "20",
                color: accessGroup.status.color
              }}
            >
              {accessGroup.status.name}
            </span>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-gray-900 font-medium">
              {new Date(accessGroup.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Updated At</p>
            <p className="text-gray-900 font-medium">
              {accessGroup.updatedAt ? new Date(accessGroup.updatedAt).toLocaleString() : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Group Type</p>
            <p className="text-gray-900 font-medium">
              {accessGroup.superAdminGroup ? "Admin Group" : "Regular Group"}
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Permissions & Roles
          <span className="ml-3 text-sm font-normal text-gray-500">
            ({accessGroup.accessGroupRoleMaps?.length || 0} total roles)
          </span>
        </h2>

        <div className="space-y-6">
          {Object.entries(groupedRoles).map(([groupName, roles]) => (
            <div key={groupName} className="border border-gray-200 rounded overflow-hidden">
              {/* Group Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {groupName}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({roles.length} {roles.length === 1 ? "role" : "roles"})
                  </span>
                </h3>
              </div>

              {/* Roles Grid */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((roleMap, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded border-2 transition-all ${
                        roleMap.isActive ? "border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {roleMap.adminRole.icon && (
                              <span className="text-lg">{roleMap.adminRole.icon}</span>
                            )}
                            <h4 className="font-semibold text-gray-900">
                              {roleMap.adminRole.name}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {roleMap.adminRole.description}
                          </p>
                          {roleMap.adminRole.parentName && roleMap.adminRole.parentName !== "ROOT" && (
                            <p className="text-xs text-gray-500">
                              Parent: {roleMap.adminRole.parentName}
                            </p>
                          )}
                        </div>

                        <div className="ml-2">
                          {roleMap.isActive ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-400 rounded-full">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessGroupView;
