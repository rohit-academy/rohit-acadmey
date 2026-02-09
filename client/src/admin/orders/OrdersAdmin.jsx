import React, { useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

function OrdersAdmin() {
  const [orders] = useState([
    { id: "ORD1234", user: "Anurag Sharma", phone: "9876543210", material: "Physics Complete Notes", amount: 99, status: "Paid", date: "01 Feb 2026" },
    { id: "ORD1235", user: "Rahul Verma", phone: "9123456780", material: "Biology Sample Paper", amount: 79, status: "Pending", date: "01 Feb 2026" },
    { id: "ORD1236", user: "Priya Singh", phone: "9988776655", material: "Chemistry PYQ", amount: 89, status: "Failed", date: "31 Jan 2026" }
  ]);

  const getStatusIcon = (status) => {
    if (status === "Paid") return <CheckCircle className="text-green-600" size={18} />;
    if (status === "Pending") return <Clock className="text-yellow-600" size={18} />;
    return <XCircle className="text-red-600" size={18} />;
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Orders Management</h1>

      {/* 💻 DESKTOP TABLE */}
      <div className="hidden md:block bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Material</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-semibold">{order.id}</td>
                <td className="p-3">{order.user}</td>
                <td className="p-3">{order.phone}</td>
                <td className="p-3">{order.material}</td>
                <td className="p-3 font-semibold text-blue-600">₹{order.amount}</td>
                <td className="p-3 flex items-center gap-2">
                  {getStatusIcon(order.status)} {order.status}
                </td>
                <td className="p-3 text-gray-600">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 MOBILE CARDS */}
      <div className="grid gap-4 md:hidden">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-xl p-4 space-y-2">
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-600">{order.id}</span>
              <span className="flex items-center gap-1 text-sm">
                {getStatusIcon(order.status)} {order.status}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium">{order.user}</span> • {order.phone}
            </div>

            <div className="text-sm text-gray-700">{order.material}</div>

            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-blue-600">₹{order.amount}</span>
              <span className="text-xs text-gray-500">{order.date}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersAdmin;
