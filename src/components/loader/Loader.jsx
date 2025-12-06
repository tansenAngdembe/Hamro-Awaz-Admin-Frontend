import { LucideLoader } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center bg-gray-50 rounded-lg shadow-md p-6">
      <div className="flex gap-6 items-center">
        {/* <div className="rounded-full p-4 border-2 border-[#1a963d]/40 animate-spin">
          <LucideLoader className="text-[#1a963d] h-[30px] w-[30px]" />
        </div> */}
        <div className="rounded-full p-4 border-2 border-[#178624]/40 animate-spin">
          <LucideLoader className="text-[#178624] h-[30px] w-[30px]" />
        </div>
      </div>
      <p className="mt-6 text-[#1a963d] text-sm font-medium">
        Please wait while we are processing your request...
      </p>
    </div>
  );
};

export default Loader;
