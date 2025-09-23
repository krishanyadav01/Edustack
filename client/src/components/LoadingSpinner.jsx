import React from "react";
import { Loader } from "lucide-react";

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-blue-600">
      <Loader className="w-16 h-16 animate-spin text-blue-600 drop-shadow-lg" />
      <p className="mt-4 text-lg font-medium text-blue-500">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
