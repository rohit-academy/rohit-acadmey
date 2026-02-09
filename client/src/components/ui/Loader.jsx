import React from "react";
import { GraduationCap } from "lucide-react";

function Loader({ text = "Loading study materials..." }) {
  return (
    <div className="flex items-center justify-center min-h-[250px]">
      <div className="flex flex-col items-center gap-4">

        {/* Animated Icon Circle */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-blue-100"></div>

          <div className="absolute inset-0 flex items-center justify-center animate-pulse">
            <GraduationCap className="text-blue-600" size={28} />
          </div>

          {/* Spinner Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <p className="text-sm text-gray-600 font-medium tracking-wide">
          {text}
        </p>

      </div>
    </div>
  );
}

export default Loader;
