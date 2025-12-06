import React, { useState } from "react";
import {
  Check,
  X,
  Eye,
  EyeOff,
  Building2,
  ShieldCheck,
  Lock,
  KeyRound,
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

const SetPasswordScreen = () => {
  const { uniqueId } = useParams();
  const [loading, setLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const requirements = [
    { id: 1, text: "At least 8 characters long", icon: <Lock size={16} /> },
    {
      id: 2,
      text: "Contains at least one uppercase letter",
      icon: <KeyRound size={16} />,
    },
    {
      id: 3,
      text: "Contains at least one lowercase letter",
      icon: <KeyRound size={16} />,
    },
    {
      id: 4,
      text: "Contains at least one number",
      icon: <KeyRound size={16} />,
    },
    {
      id: 5,
      text: "Contains at least one special character",
      icon: <ShieldCheck size={16} />,
    },
    { id: 6, text: "Passwords match", icon: <Check size={16} /> },
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
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    api
      .post("/setPassword", {
        password: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
        uuid: uniqueId,
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

  const handleChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
          className="w-full px-4 py-2 pr-12 border border-gray-400 rounded-md transition-all"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-2xl shadow-md">
              <Building2 size={40} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Hamro Awaz Admin
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your Hamro Awaz Admin account has been created. Please set your
            password to continue.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Password Form */}
            <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderPasswordInput(
                  "newPassword",
                  "New Password",
                  "Enter your password"
                )}
                {renderPasswordInput(
                  "confirmPassword",
                  "Confirm Password",
                  "Confirm your password"
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium flex items-center justify-center"
                >
                  <Lock size={18} className="mr-2" />
                  {loading ? "Processing..." : "Set Password"}
                </button>
              </form>
            </div>

            {/* Requirements */}
            <div className="bg-gray-50/80 backdrop-blur-sm p-6 sm:p-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <ShieldCheck size={16} className="mr-2 text-blue-600" />
                Password Requirements
              </h3>
              <ul className="space-y-3">
                {requirements.map((requirement) => (
                  <li key={requirement.id} className="flex items-start">
                    <div className="mr-2 mt-0.5 text-blue-600">
                      {requirement.icon}
                    </div>
                    <span
                      className={`text-sm ${
                        checkRequirement(requirement.text)
                          ? "text-green-700"
                          : "text-gray-600"
                      }`}
                    >
                      {requirement.text}
                    </span>
                    <span className="ml-auto">
                      {checkRequirement(requirement.text) ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <X size={16} className="text-red-500" />
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-blue-50/80 backdrop-blur-sm rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700">
                  <strong>Tip:</strong> Choose a password you haven't used
                  before and avoid using personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordScreen;
