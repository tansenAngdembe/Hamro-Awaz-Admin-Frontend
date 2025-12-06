import React, { useEffect, useState } from "react";

const alertStyles = {
  success: {
    border: "border-green-500",
    iconColor: "text-green-500",
    title: "Success",
    iconPath:
      "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
  },
  error: {
    border: "border-red-500",
    iconColor: "text-red-500",
    title: "Error",
    iconPath: "M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V5z",
  },
  info: {
    border: "border-blue-500",
    iconColor: "text-blue-500",
    title: "Info",
    iconPath: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11h-2v2h2V7zm0 4h-2v4h2v-4z",
  },
};

const Alert = ({ message, type = "success", duration = 500, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), duration);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const { border, iconColor, title, iconPath } = alertStyles[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md`}
    >
      <div
        className={`flex items-start p-4 bg-white border-l-4 ${border} rounded shadow-md`}
      >
        <svg
          className={`w-5 h-5 mt-1 ${iconColor}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
        </svg>
        <div className="ms-3 text-sm">
          <p className="font-semibold text-gray-900">{title} Notification</p>
          <p className="text-gray-600">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ms-auto text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;
