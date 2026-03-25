import React, { useEffect, useState } from "react";
import ClassCard from "../components/cards/ClassCard";
import API from "../services/api";
import Loader from "../components/ui/Loader";

function Classes() {

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    let isMounted = true;

    const fetchClasses = async () => {

      try {

        setLoading(true);
        setError("");

        const res = await API.get("/classes");

        if (!isMounted) return;

        const list = res.data?.data || [];

        if (!Array.isArray(list)) {
          setClasses([]);
          return;
        }

        // 🔥 SORT by order
        const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));

        setClasses(sorted);

      } catch (err) {

        if (!isMounted) return;

        console.error("Classes fetch error:", err);
        setError("Failed to load classes");

      } finally {

        if (isMounted) setLoading(false);

      }
    };

    fetchClasses();

    return () => {
      isMounted = false;
    };

  }, []);

  /* ⏳ LOADING */
  if (loading) return <Loader />;

  /* ❌ ERROR */
  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-red-600 font-bold mb-3">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ❌ EMPTY */
  if (!classes.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">
          No classes available
        </h2>
        <p className="text-gray-500">
          Classes will be added soon.
        </p>
      </div>
    );
  }

  return (

    <div className="max-w-6xl mx-auto px-4">

      <h1 className="text-3xl font-bold text-center mb-8">
        Choose Your Class
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {classes.map((cls) => {

          if (!cls?._id) return null;

          /* 🔥 SAFE CLASS LOGIC */
          const isSenior = ["11", "12"].includes(cls.name);

          const route = isSenior
            ? `/streams/${cls.name}`   // ✅ FIXED
            : `/subjects/${cls._id}`;

          return (
            <ClassCard
              key={cls._id}
              id={cls._id}
              name={cls.name}
              route={route}
            />
          );
        })}

      </div>

    </div>

  );

}

export default Classes;