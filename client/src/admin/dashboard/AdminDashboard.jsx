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
  const [refreshing, setRefreshing] = useState(false);

  /* =====================================
     📦 FETCH STATS
  ===================================== */
  const fetchStats = async (silent = false) => {

    try {

      if (!silent) setLoading(true);
      setRefreshing(true);
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

      console.error("❌ Stats fetch error:", err);

      if (!silent) {
        setError("Failed to load dashboard");
      }

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };

  /* =====================================
     🚀 INITIAL LOAD + AUTO REFRESH
  ===================================== */
  useEffect(() => {

    fetchStats();

    const interval = setInterval(() => {
      fetchStats(true); // 🔥 silent refresh
    }, 30000); // every 30s

    return () => clearInterval(interval);

  }, []);

  /* =====================================
     🔢 FORMAT
  ===================================== */
  const formatNumber = (num = 0) =>
    Number(num).toLocaleString("en-IN");

  /* =====================================
     ⏳ LOADING SKELETON
  ===================================== */
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {[1,2,3,4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow animate-pulse">
            <div className="h-6 w-20 bg-gray-200 mb-4 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  /* =====================================
     ❌ ERROR
  ===================================== */
  if (error) {
    return (
      <div className="text-center py-20">

        <p className="text-red-500 mb-4">
          {error}
        </p>

        <button
          onClick={() => fetchStats()}
          className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Retry
        </button>

      </div>
    );
  }

  /* =====================================
     📊 STATS CONFIG
  ===================================== */
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

      {/* 🔄 REFRESH BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => fetchStats()}
          className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

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
                {formatNumber(item.value)}
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
            {import.meta.env.MODE || "Production"}
          </span>
        </p>

      </div>

    </div>

  );

}

/* =====================================
   🔥 ACTION CARD
===================================== */
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