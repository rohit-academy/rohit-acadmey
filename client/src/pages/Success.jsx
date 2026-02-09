import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Download, Home } from "lucide-react";

function Success() {
  return (
    <div className="max-w-xl mx-auto text-center bg-white p-10 rounded-xl shadow mt-10">

      <CheckCircle className="mx-auto text-green-500 mb-4" size={60} />

      <h1 className="text-3xl font-bold mb-2 text-green-700">
        Payment Successful!
      </h1>

      <p className="text-gray-600 mb-6">
        Your study materials have been unlocked and are ready for download.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">

        <Link
          to="/downloads"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Download size={18} /> Go to My Downloads
        </Link>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
        >
          <Home size={18} /> Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Success;
