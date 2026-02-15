import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Download,
  ShoppingCart,
  Settings
} from "lucide-react";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalDownloads: 0
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats({
        totalMaterials: data.totalMaterials || 0,
        totalUsers: data.totalUsers || 0,
        totalOrders: data.totalOrders || 0,
        totalDownloads: data.totalDownloads || 0
      });

    } catch (error) {
      console.error("Stats fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Total Materials",
      value: stats.totalMaterials,
      icon: <FileText size={28} className="text-blue-600" />
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={28} className="text-green-600" />
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart size={28} className="text-purple-600" />
    },
    {
      title: "Total Downloads",
      value: stats.totalDownloads,
      icon: <Download size={28} className="text-pink-600" />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* 📊 Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsCards.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow flex items-center gap-4"
          >
            {item.icon}
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ⚙ Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-2">📚 Manage Study Materials</h3>
          <p className="text-sm text-gray-600">
            Add, edit or remove PDFs and notes.
          </p>
          <button
            onClick={() => navigate("/admin/materials")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Open
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-2">👨‍🎓 Manage Users</h3>
          <p className="text-sm text-gray-600">
            View students and activity.
          </p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Open
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-semibold mb-2">💰 Orders & Payments</h3>
          <p className="text-sm text-gray-600">
            Track purchases and revenue.
          </p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Open
          </button>
        </div>
      </div>

      {/* ⚡ System */}
      <div className="mt-12 bg-white p-6 rounded-xl shadow flex items-center gap-4">
        <Settings className="text-gray-600" />
        <p className="text-sm text-gray-600">
          System running in{" "}
          <span className="font-semibold">Development Mode</span>
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
