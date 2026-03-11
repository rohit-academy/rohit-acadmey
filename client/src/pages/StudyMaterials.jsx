import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/ui/Loader";
import FilterBar from "../components/ui/FilterBar";
import ProductCard from "../components/cards/ProductCard";
import API from "../services/api";

function StudyMaterials() {

  const { classId, subjectId } = useParams();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {

    const fetchMaterials = async () => {

      try {

        const res = await API.get(
          `/materials?classId=${classId}&subjectId=${subjectId}`
        );

        const list =
          res.data?.data ||
          res.data ||
          [];

        setMaterials(list);

      } catch (error) {

        console.error("Materials fetch error:", error);
        setMaterials([]);

      } finally {

        setLoading(false);

      }

    };

    if (classId && subjectId) fetchMaterials();

  }, [classId, subjectId]);

  const filters = ["All", "Notes", "Sample Paper", "PYQ", "Assignment"];

  const filteredMaterials =
    activeFilter === "All"
      ? materials
      : materials.filter((m) => m.type === activeFilter);

  if (loading) return <Loader />;

  return (

    <div className="max-w-6xl mx-auto">

      <div className="text-center mb-8">

        <h1 className="text-3xl md:text-4xl font-bold">
          Study Materials
        </h1>

        <p className="text-gray-600 mt-2">
          Notes, Sample Papers & Previous Year Questions
        </p>

      </div>

      <FilterBar
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {filteredMaterials.length === 0 ? (

        <div className="text-center py-16">

          <h2 className="text-xl font-semibold mb-2">
            No materials found
          </h2>

          <p className="text-gray-600">
            Study content for this subject is being prepared.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-3 gap-6 mt-6">

          {filteredMaterials.map((item) => (

            <ProductCard
              key={item._id}
              {...item}
            />

          ))}

        </div>

      )}

    </div>

  );

}

export default StudyMaterials;