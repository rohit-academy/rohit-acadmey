import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Download,
  ShoppingCart,
  Settings,
  RefreshCw
} from "lucide-react";
import API from "../../services/api";

function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalDownloads: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     📦 FETCH STATS
  ========================= */
  const fetchStats = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await API.get("/admin/stats");

      const data = res.data?.data || res.data || {};

      setStats({
        totalMaterials: data.totalMaterials || 0,
        totalUsers: data.totalUsers || 0,
        totalOrders: data.totalOrders || 0,
        totalDownloads: data.totalDownloads || 0
      });

    } catch (err) {

      console.error("Stats fetch error:", err);

      setError("Failed to load dashboard");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchStats();
  }, []);

  /* =========================
     ⏳ LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* =========================
     ❌ ERROR UI
  ========================= */
  if (error) {
    return (
      <div className="text-center py-20">

        <p className="text-red-500 mb-4">
          {error}
        </p>

        <button
          onClick={fetchStats}
          className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Retry
        </button>

      </div>
    );
  }

  /* =========================
     📊 STATS CARDS
  ========================= */
  const statsCards = [
    {
      title: "Total Materials",
      value: stats.totalMaterials,
      icon: <FileText size={26} />,
      color: "blue"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={26} />,
      color: "green"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart size={26} />,
      color: "purple"
    },
    {
      title: "Total Downloads",
      value: stats.totalDownloads,
      icon: <Download size={26} />,
      color: "pink"
    }
  ];

  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    pink: "bg-pink-100 text-pink-600"
  };

  return (

    <div className="p-4 md:p-6">

      {/* ================= STATS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        {statsCards.map((item, index) => (

          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-4"
          >

            <div className={`p-3 rounded-lg ${colorMap[item.color]}`}>
              {item.icon}
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                {item.title}
              </p>
              <p className="text-2xl font-bold">
                {item.value}
              </p>
            </div>

          </div>

        ))}

      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <ActionCard
          title="📚 Manage Materials"
          desc="Add, edit or remove PDFs"
          color="blue"
          onClick={() => navigate("/admin/materials")}
        />

        <ActionCard
          title="👨‍🎓 Manage Users"
          desc="View and manage students"
          color="green"
          onClick={() => navigate("/admin/users")}
        />

        <ActionCard
          title="💰 Orders & Payments"
          desc="Track revenue & purchases"
          color="purple"
          onClick={() => navigate("/admin/orders")}
        />

      </div>

      {/* ================= SYSTEM ================= */}
      <div className="mt-12 bg-white p-5 rounded-xl shadow flex items-center gap-3">

        <Settings className="text-gray-600" />

        <p className="text-sm text-gray-600">
          System running in{" "}
          <span className="font-semibold text-blue-600">
            Development Mode
          </span>
        </p>

      </div>

    </div>

  );

}

/* =========================
   🔥 ACTION CARD
========================= */
function ActionCard({ title, desc, onClick, color }) {

  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

      <h3 className="font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-600">
        {desc}
      </p>

      <button
        onClick={onClick}
        className={`mt-4 text-white px-4 py-2 rounded-lg ${colorMap[color]}`}
      >
        Open
      </button>

    </div>
  );
}

export default AdminDashboard;