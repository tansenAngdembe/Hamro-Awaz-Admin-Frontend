import { ArrowLeft, Check, Eye, EyeOff, Move, MoveLeft, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import Alert from "../../components/alerts/Alert";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const requirements = [
    { id: 1, text: "At least 8 characters long" },
    { id: 2, text: "Contains at least one uppercase letter" },
    { id: 3, text: "Contains at least one lowercase letter" },
    { id: 4, text: "Contains at least one number" },
    { id: 5, text: "Contains at least one special character" },
    { id: 6, text: "Passwords match" },
  ];

  const checkRequirement = (requirement) => {
    const password = passwords.newPassword;
    switch (requirement) {
      case "At least 8 characters long":
        return password.length >= 8;
      case "Contains at least one uppercase letter":
        return /[A-Z]/.test(password);
      case "Contains at least one lowercase letter":
        return /[a-z]/.test(password);
      case "Contains at least one number":
        return /[0-9]/.test(password);
      case "Contains at least one special character":
        return /[!@#$%^&*(),.?":{}|<>]/.test(password);
      case "Passwords match":
        return (
          passwords.newPassword !== "" &&
          passwords.newPassword === passwords.confirmPassword
        );
      default:
        return false;
    }
  };
  const handleChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    api
      .post("/changePassword", {
        oldPassword: passwords.oldPassword,
        password: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      })
      .then((response) => {
        if (response.data.code == 200) {
          Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success",
            confirmButtonColor: "#5569FE",
            timer: 2000,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: true,
          }).then(() => {
            window.location.replace("/login");
          });
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong on server");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderPasswordInput = (name, label, placeholder = "") => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPasswords[name] ? "text" : "password"}
          id={name}
          name={name}
          value={passwords[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-12 border border-gray-400 rounded-sm transition-all"
          required
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(name)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPasswords[name] ? (
            <EyeOff size={20} className="text-gray-500" />
          ) : (
            <Eye size={20} className="text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-2">
          <MoveLeft onClick={handleBackClick} className="cursor-pointer" />
          <h2 className="text-xl font-semibold">CHANGE PASSWORD</h2>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        Update your Goal Post Password
      </p>
      <div className="w-full h-px bg-gray-200 mb-4"></div>

      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Password Form */}
          <div className="flex-1 p-0 lg:p-4 border-b lg:border-b-0 lg:border-r border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
              {renderPasswordInput("oldPassword", "Current Password")}
              {renderPasswordInput("newPassword", "New Password")}
              {renderPasswordInput("confirmPassword", "Confirm New Password")}

              <button
                type="submit"
                disabled={loading}
                className={`bg-[#5569FE] text-white font-medium px-5 py-2 transition-colors w-full md:w-auto
                ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-[#4153e8] cursor-pointer"
                }`}
              >
                {loading ? "Processing..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Password Requirements */}
          <div className="w-full lg:w-96 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Password Requirements
            </h3>
            <ul className="space-y-3">
              {requirements.map((requirement) => (
                <li key={requirement.id} className="flex items-start">
                  {checkRequirement(requirement.text) ? (
                    <Check
                      size={16}
                      className="text-green-500 mt-0.5 mr-2 flex-shrink-0"
                    />
                  ) : (
                    <X
                      size={16}
                      className="text-red-500 mt-0.5 mr-2 flex-shrink-0"
                    />
                  )}
                  <span
                    className={`text-sm ${
                      checkRequirement(requirement.text)
                        ? "text-green-700"
                        : "text-gray-600"
                    }`}
                  >
                    {requirement.text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Tip:</strong> Choose a password you haven't used before
                and avoid using personal information.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Alerts */}
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
export default ChangePassword;
