import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/ui/Loader";
import FilterBar from "../components/ui/FilterBar";
import ProductCard from "../components/cards/ProductCard";
import { useProducts } from "../context/ProductContext";

function StudyMaterials() {
  const { subjectId } = useParams();
  const { products } = useProducts();

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // 🔤 Convert URL slug to Title
  const subjectTitle = useMemo(() => {
    return subjectId
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [subjectId]);

  if (loading) return <Loader />;

  // 🎯 Subject products
  const subjectProducts = products.filter(
    (p) => p.subject.toLowerCase().replace(/\s+/g, "-") === subjectId
  );

  const filters = ["All", "Notes", "Sample Paper", "PYQ"];

  const filteredMaterials =
    activeFilter === "All"
      ? subjectProducts
      : subjectProducts.filter((m) => m.type === activeFilter);

  return (
    <div className="max-w-6xl mx-auto">

      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          {subjectTitle} Study Materials
        </h1>
        <p className="text-gray-600 mt-2">
          Notes, Sample Papers & Previous Year Questions
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Content */}
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
            <ProductCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudyMaterials;
