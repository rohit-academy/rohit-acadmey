import React from "react";
import { TrendingUp, ShoppingCart, IndianRupee, Package } from "lucide-react";

function SalesReport() {
  // 🔥 Dummy data (future me backend se aayega)
  const stats = {
    totalSales: 45890,
    todaySales: 2890,
    monthlySales: 15890,
    totalOrders: 124
  };

  const topProducts = [
    { name: "Physics Complete Notes", sales: 54 },
    { name: "Chemistry Sample Papers", sales: 41 },
    { name: "Biology PYQ Book", sales: 33 }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Sales Report</h1>

      {/* 🔢 Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <IndianRupee size={32} className="text-green-600" />
          <div>
            <p className="text-gray-600">Total Sales</p>
            <h2 className="text-xl font-bold">₹{stats.totalSales}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <TrendingUp size={32} className="text-blue-600" />
          <div>
            <p className="text-gray-600">Today Sales</p>
            <h2 className="text-xl font-bold">₹{stats.todaySales}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <Package size={32} className="text-purple-600" />
          <div>
            <p className="text-gray-600">Monthly Sales</p>
            <h2 className="text-xl font-bold">₹{stats.monthlySales}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <ShoppingCart size={32} className="text-orange-600" />
          <div>
            <p className="text-gray-600">Total Orders</p>
            <h2 className="text-xl font-bold">{stats.totalOrders}</h2>
          </div>
        </div>

      </div>

      {/* 🏆 Top Selling Materials */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Top Selling Materials</h2>

        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Material</th>
              <th className="p-3">Sales</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{item.name}</td>
                <td className="p-3 font-semibold text-green-600">{item.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesReport;
