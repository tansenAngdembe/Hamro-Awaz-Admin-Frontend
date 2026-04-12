import React from "react";
import { Inbox } from "lucide-react";

const DataNotFound = ({
  title = "No data found",
  description = "Try adjusting your search or filters",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-gray-500 ${className}`}
    >
      <Inbox size={42} className="mb-3 text-gray-400" />
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-sm mt-1 text-gray-500">{description}</p>
    </div>
  );
};

export default DataNotFound;
