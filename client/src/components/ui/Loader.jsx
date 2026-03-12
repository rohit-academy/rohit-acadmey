import React from "react";
import { GraduationCap } from "lucide-react";

function Loader({ text = "Loading study materials..." }) {

  return (

    <div className="flex items-center justify-center min-h-[300px]">

      <div className="flex flex-col items-center gap-5">

        {/* Spinner Container */}

        <div className="relative w-16 h-16 flex items-center justify-center">

          {/* Soft Glow */}

          <div className="absolute w-16 h-16 bg-blue-200 rounded-full blur-xl opacity-40 animate-pulse"></div>

          {/* Spinner Ring */}

          <div className="absolute w-16 h-16 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin"></div>

          {/* Secondary Ring */}

          <div className="absolute w-12 h-12 rounded-full border-[3px] border-blue-300 border-b-transparent animate-spin [animation-duration:1.8s]"></div>

          {/* Icon */}

          <div className="relative animate-bounce">

            <GraduationCap
              className="text-blue-600"
              size={26}
            />

          </div>

        </div>

        {/* Text */}

        <p className="text-sm text-gray-600 font-medium tracking-wide flex items-center gap-1">

          {text}

          <span className="flex gap-1 ml-1">

            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>

          </span>

        </p>

      </div>

    </div>

  );

}

export default Loader;