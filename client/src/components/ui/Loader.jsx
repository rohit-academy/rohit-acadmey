import React from "react";
import { GraduationCap } from "lucide-react";

function Loader({ text = "Loading study materials..." }) {

  return (

    <div className="flex items-center justify-center min-h-[320px] px-4">

      <div className="flex flex-col items-center gap-6">

        {/* Spinner Area */}

        <div className="relative flex items-center justify-center w-20 h-20">

          {/* Background Glow */}

          <div className="absolute w-20 h-20 bg-blue-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>

          {/* Outer Ring */}

          <div className="absolute w-20 h-20 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin"></div>

          {/* Middle Ring */}

          <div className="absolute w-16 h-16 rounded-full border-[3px] border-blue-300 border-b-transparent animate-spin [animation-duration:1.8s]"></div>

          {/* Inner Ring */}

          <div className="absolute w-12 h-12 rounded-full border-[3px] border-blue-200 border-l-transparent animate-spin [animation-duration:2.4s]"></div>

          {/* Center Icon */}

          <div className="relative flex items-center justify-center">

            <div className="animate-[float_3s_ease-in-out_infinite]">

              <GraduationCap
                size={28}
                className="text-blue-600"
              />

            </div>

          </div>

        </div>

        {/* Loading Text */}

        <div className="flex flex-col items-center gap-2">

          <p className="text-sm text-gray-600 font-medium tracking-wide">

            {text}

          </p>

          {/* Animated Dots */}

          <div className="flex gap-2">

            <span className="w-2 h-2 bg-blue-500 rounded-full animate-[wave_1.4s_infinite]"></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-[wave_1.4s_infinite] [animation-delay:0.2s]"></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-[wave_1.4s_infinite] [animation-delay:0.4s]"></span>

          </div>

        </div>

      </div>

      {/* Custom Animations */}

      <style>
        {`

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        @keyframes wave {
          0% { transform: translateY(0); opacity: .6; }
          50% { transform: translateY(-4px); opacity: 1; }
          100% { transform: translateY(0); opacity: .6; }
        }

        `}
      </style>

    </div>

  );

}

export default Loader;