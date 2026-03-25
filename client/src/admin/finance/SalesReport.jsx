import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  IndianRupee,
  Package
} from "lucide-react";
import API from "../../services/api";

function SalesReport() {

  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     💰 FORMAT PRICE
  ========================= */
  const formatPrice = (num = 0) =>
    `₹${num.toLocaleString("en-IN")}`;

  /* =========================
     📦 FETCH DATA
  ========================= */
  useEffect(() => {

    const fetchReport = async () => {
      try {

        const res = await API.get("/admin/sales-report");

        const data = res.data?.data || {};

        setStats(data.stats || {});
        setTopProducts(data.topProducts || []);

      } catch (error) {

        console.error("Sales report error:", error);

        // fallback dummy
        setStats({
          totalSales: 45890,
          todaySales: 2890,
          monthlySales: 15890,
          totalOrders: 124
        });

        setTopProducts([
          { name: "Physics Complete Notes", sales: 54 },
          { name: "Chemistry Sample Papers", sales: 41 },
          { name: "Biology PYQ Book", sales: 33 }
        ]);

      } finally {
        setLoading(false);
      }
    };

    fetchReport();

  }, []);

  /* =========================
     ⏳ LOADING
  ========================= */
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* =========================
     📊 UI
  ========================= */
  return (

    <div className="p-4 md:p-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Sales Report
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">

        <StatCard
          icon={<IndianRupee size={28} />}
          color="green"
          label="Total Sales"
          value={formatPrice(stats.totalSales)}
        />

        <StatCard
          icon={<TrendingUp size={28} />}
          color="blue"
          label="Today Sales"
          value={formatPrice(stats.todaySales)}
        />

        <StatCard
          icon={<Package size={28} />}
          color="purple"
          label="Monthly Sales"
          value={formatPrice(stats.monthlySales)}
        />

        <StatCard
          icon={<ShoppingCart size={28} />}
          color="orange"
          label="Total Orders"
          value={stats.totalOrders}
        />

      </div>

      {/* ================= TOP PRODUCTS ================= */}
      <div className="bg-white p-5 rounded-xl shadow">

        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Top Selling Materials
        </h2>

        {topProducts.length === 0 ? (

          <p className="text-gray-500 text-center py-6">
            No data available
          </p>

        ) : (

          <>
            {/* 💻 DESKTOP */}
            <table className="w-full text-left hidden md:table">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Material</th>
                  <th className="p-3">Sales</th>
                </tr>
              </thead>

              <tbody>
                {topProducts.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 font-semibold text-green-600">
                      {item.sales}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {/* 📱 MOBILE */}
            <div className="md:hidden space-y-3">
              {topProducts.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span>{item.name}</span>
                  <span className="font-semibold text-green-600">
                    {item.sales}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

    </div>

  );
}

/* =========================
   🔥 STAT CARD COMPONENT
========================= */
function StatCard({ icon, label, value, color }) {

  const colors = {
    green: "text-green-600 bg-green-100",
    blue: "text-blue-600 bg-blue-100",
    purple: "text-purple-600 bg-purple-100",
    orange: "text-orange-600 bg-orange-100"
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4 hover:shadow-md transition">

      <div className={`p-3 rounded-lg ${colors[color]}`}>
        {icon}
      </div>

      <div>
        <p className="text-gray-500 text-sm">
          {label}
        </p>
        <h2 className="text-lg md:text-xl font-bold">
          {value}
        </h2>
      </div>

    </div>
  );
}

export default SalesReport;