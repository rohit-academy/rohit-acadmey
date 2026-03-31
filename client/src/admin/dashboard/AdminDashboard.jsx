import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Download,
  ShoppingCart,
  Settings,
  RefreshCw,
  IndianRupee,
  TrendingUp
} from "lucide-react";
import API from "../../services/api";

function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalDownloads: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  /* =====================================
     📦 FETCH STATS (SMART)
  ===================================== */
  const fetchStats = async (silent = false) => {

    try {

      if (!silent) setLoading(true);
      setRefreshing(true);

      const res = await API.get("/admin/stats");

      const data = res.data?.data || res.data || {};

      setStats({
        totalMaterials: data.totalMaterials || 0,
        totalUsers: data.totalUsers || 0,
        totalOrders: data.totalOrders || 0,
        totalDownloads: data.totalDownloads || 0,
        totalRevenue: data.totalRevenue || 0
      });

      setError("");

    } catch (err) {

      console.error("❌ Stats error:", err);

      if (!silent) {
        setError("Dashboard load failed");
      }

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };

  /* =====================================
     🚀 INIT + AUTO REFRESH
  ===================================== */
  useEffect(() => {

    fetchStats();

    const interval = setInterval(() => {
      fetchStats(true);
    }, 30000);

    return () => clearInterval(interval);

  }, []);

  /* =====================================
     🔢 FORMATTERS
  ===================================== */
  const formatNumber = (num = 0) =>
    Number(num).toLocaleString("en-IN");

  const formatCurrency = (num = 0) =>
    "₹" + Number(num).toLocaleString("en-IN");

  /* =====================================
     ⏳ LOADING UI
  ===================================== */
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="bg-white p-5 rounded-xl shadow animate-pulse">
            <div className="h-5 w-24 bg-gray-200 mb-3 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  /* =====================================
     ❌ ERROR UI
  ===================================== */
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>

        <button
          onClick={() => fetchStats()}
          className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 py-2 rounded-lg"
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
      title: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: <IndianRupee size={24} />,
      color: "yellow"
    },
    {
      title: "Materials",
      value: formatNumber(stats.totalMaterials),
      icon: <FileText size={24} />,
      color: "blue"
    },
    {
      title: "Users",
      value: formatNumber(stats.totalUsers),
      icon: <Users size={24} />,
      color: "green"
    },
    {
      title: "Orders",
      value: formatNumber(stats.totalOrders),
      icon: <ShoppingCart size={24} />,
      color: "purple"
    },
    {
      title: "Downloads",
      value: formatNumber(stats.totalDownloads),
      icon: <Download size={24} />,
      color: "pink"
    }
  ];

  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    pink: "bg-pink-100 text-pink-600",
    yellow: "bg-yellow-100 text-yellow-600"
  };

  /* =====================================
     UI
  ===================================== */
  return (

    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="text-blue-600" />
          Dashboard Overview
        </h1>

        <button
          onClick={() => fetchStats()}
          className="flex items-center gap-2 text-sm bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>

      </div>

      {/* ================= STATS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

        {statsCards.map((item, i) => (

          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition flex items-center gap-4"
          >

            <div className={`p-3 rounded-lg ${colorMap[item.color]}`}>
              {item.icon}
            </div>

            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>

          </div>

        ))}

      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

      <div className="grid md:grid-cols-3 gap-6">

        <ActionCard
          title="📚 Manage Materials"
          desc="Add / edit study content"
          color="blue"
          onClick={() => navigate("/admin/materials")}
        />

        <ActionCard
          title="👨‍🎓 Manage Users"
          desc="Control users & access"
          color="green"
          onClick={() => navigate("/admin/users")}
        />

        <ActionCard
          title="💰 Orders & Payments"
          desc="Track earnings & orders"
          color="purple"
          onClick={() => navigate("/admin/orders")}
        />

      </div>

      {/* ================= SYSTEM ================= */}
      <div className="mt-12 bg-white p-5 rounded-xl shadow flex items-center gap-3">

        <Settings className="text-gray-600" />

        <p className="text-sm text-gray-600">
          Mode:
          <span className="font-semibold text-blue-600 ml-1">
            {import.meta.env.MODE || "production"}
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

      <h3 className="font-semibold mb-2">{title}</h3>

      <p className="text-sm text-gray-600">{desc}</p>

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