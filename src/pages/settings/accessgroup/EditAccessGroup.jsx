import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Shield, CheckSquare, Square, MoveLeft } from "lucide-react";
import api from "../../../api/axios";
import Alert from "../../../components/alerts/Alert";
import Loader from "../../../components/loader/Loader";

const EditAccessGroup = () => {
    const navigate = useNavigate();
    const { uniqueId } = useParams();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [adminRoles, setAdminRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        remarks: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (uniqueId) {
            fetchAdminRoles();
            fetchAccessGroup();
        } else {
            navigate(-1);
        }
    }, [uniqueId]);

    const fetchAdminRoles = async () => {
        try {
            const response = await api.get("/accessGroup/adminRole/list");
            if (response.data.code === 200) {
                const rolesData = response.data.data || [];
                setAdminRoles(Array.isArray(rolesData) ? rolesData : []);
            } else {
                setErrorMessage(response.data.message || "Failed to load admin roles");
            }
        } catch (error) {
            setErrorMessage("Failed to load admin roles");
        }
    };

    // FIXED ROLE MAPPING
    const fetchAccessGroup = async () => {
        try {
            const response = await api.post("/accessGroup/view", { id: uniqueId });
            if (response.data.code === 200) {
                const groupData = response.data.data;

                setFormData({
                    name: groupData.name || "",
                    description: groupData.description || "",
                    remarks: groupData.remarks || "",
                });

                // FIXED: vendorAccessGroupRoleMaps → vendorUserRole.name
                const roleNames =
                    groupData.accessGroupRoleMaps?.map(
                        (roleMap) => roleMap.adminRole.name
                    ) || [];

                setSelectedRoles(roleNames);
            } else {
                setErrorMessage(response.data.message || "Failed to load access group");
                navigate(-1);
            }
        } catch (error) {
            setErrorMessage("Failed to load access group");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // FIXED permission → name
    const handleRoleToggle = (roleName) => {
        setSelectedRoles((prev) =>
            prev.includes(roleName)
                ? prev.filter((name) => name !== roleName)
                : [...prev, roleName]
        );
    };

    const handleSelectAll = () => {
        if (selectedRoles.length === adminRoles.length) {
            setSelectedRoles([]);
        } else {
            setSelectedRoles(adminRoles.map((role) => role.name));
        }
    };

    const handleSelectGroup = (groupName) => {
        const groupRoles = adminRoles.filter((role) => role.uiGroupName === groupName);
        const groupRoleNames = groupRoles.map((role) => role.name);
        const allSelected = groupRoleNames.every((name) =>
            selectedRoles.includes(name)
        );

        if (allSelected) {
            setSelectedRoles((prev) =>
                prev.filter((name) => !groupRoleNames.includes(name))
            );
        } else {
            setSelectedRoles((prev) => [...new Set([...prev, ...groupRoleNames])]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setErrorMessage("Please enter a group name");
            return;
        }

        if (!formData.description.trim()) {
            setErrorMessage("Please enter a description");
            return;
        }

        if (!formData.remarks.trim()) {
            setErrorMessage("Please enter remarks");
            return;
        }

        if (selectedRoles.length === 0) {
            setErrorMessage("Please select at least one role");
            return;
        }

        setSubmitting(true);

        try {
            const requestData = {
                id: uniqueId,
                name: formData.name.trim(),
                description: formData.description.trim(),
                remarks: formData.remarks.trim(),
                roleNames: selectedRoles,
            };

            const response = await api.post("/accessGroup/update", requestData);

            if (response.data.code === 200) {
                setSuccessMessage(response.data.message);
                setTimeout(() => navigate(-1), 2000);
            } else {
                setErrorMessage(response.data.message || "Update failed");
            }
        } catch (error) {
            setErrorMessage("Failed to update access group");
        } finally {
            setSubmitting(false);
        }
    };

    const groupRolesByUIGroup = () => {
        const grouped = {};
        adminRoles.forEach((role) => {
            const groupName = role.uiGroupName || "Other";
            if (!grouped[groupName]) grouped[groupName] = [];
            grouped[groupName].push(role);
        });
        Object.keys(grouped).forEach((key) => {
            grouped[key].sort((a, b) => a.position - b.position);
        });
        return grouped;
    };

    if (loading) return <Loader />;

    const groupedRoles = groupRolesByUIGroup();
    const allSelected = selectedRoles.length === adminRoles.length;

    return (
        <div className="space-y-6 p-4">
            <div className="flex items-center mb-4">
                <button
                    type="button"
                    className="flex items-center text-green-600 hover:text-green-800"
                    onClick={() => navigate(-1)}
                >
                    <MoveLeft className="mr-2" />
                    Back to Access Groups
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border rounded p-4 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-5 w-5" />
                        <h2 className="font-semibold text-lg">Edit Access Group</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Group Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Description *</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <div className="flex flex-col md:col-span-2">
                            <label className="mb-1 font-medium">Remarks *</label>
                            <textarea
                                value={formData.remarks}
                                onChange={(e) => handleChange("remarks", e.target.value)}
                                rows={3}
                                className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="border rounded p-4 shadow-sm space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="font-semibold">Select Roles & Permissions</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Choose the roles and permissions for this access group
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 border rounded text-sm">
                                {selectedRoles.length} of {adminRoles.length} selected
                            </span>
                            <button
                                type="button"
                                className="px-2 py-1 border rounded text-sm text-green-600 hover:text-green-800"
                                onClick={handleSelectAll}
                            >
                                {allSelected ? "Deselect All" : "Select All"}
                            </button>
                        </div>
                    </div>

                    {Object.entries(groupedRoles).map(([groupName, roles], idx) => {
                        const groupRoleNames = roles.map((r) => r.name);
                        const groupSelectedCount = groupRoleNames.filter((p) =>
                            selectedRoles.includes(p)
                        ).length;
                        const allGroupSelected = groupSelectedCount === roles.length;

                        return (
                            <div key={groupName} className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectGroup(groupName)}
                                        className="flex items-center space-x-2 font-medium text-left"
                                    >
                                        {allGroupSelected ? (
                                            <CheckSquare className="h-5 w-5 text-green-600" />
                                        ) : groupSelectedCount > 0 ? (
                                            <CheckSquare className="h-5 w-5 text-green-600 opacity-50" />
                                        ) : (
                                            <Square className="h-5 w-5" />
                                        )}
                                        <span>{groupName}</span>
                                    </button>
                                    <span className="text-sm bg-gray-200 px-2 py-0.5 rounded">
                                        {groupSelectedCount}/{roles.length}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-4">
                                    {roles.map((role) => {
                                        const isSelected = selectedRoles.includes(role.name);
                                        return (
                                            <label
                                                key={role.name}
                                                className={`flex items-start space-x-2 p-2 border rounded cursor-pointer ${
                                                    isSelected
                                                        ? "border-green-600 bg-green-50"
                                                        : "border-gray-300 hover:border-green-400"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleRoleToggle(role.name)}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {role.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {role.description}
                                                    </p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>

                                {idx < Object.keys(groupedRoles).length - 1 && (
                                    <hr className="mt-2 border-gray-300" />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="border rounded p-4 shadow-sm flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        {selectedRoles.length === 0 ? (
                            <span className="text-green-600">
                                Please select at least one role
                            </span>
                        ) : (
                            <span>
                                {selectedRoles.length} role
                                {selectedRoles.length !== 1 ? "s" : ""} selected
                            </span>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={submitting}
                            className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || selectedRoles.length === 0}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {submitting ? "Updating..." : "Update Access Group"}
                        </button>
                    </div>
                </div>
            </form>

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    duration={2000}
                    onClose={() => setSuccessMessage("")}
                />
            )}

            {errorMessage && (
                <Alert
                    type="error"
                    message={errorMessage}
                    duration={2000}
                    onClose={() => setErrorMessage("")}
                />
            )}
        </div>
    );
};

export default EditAccessGroup;
