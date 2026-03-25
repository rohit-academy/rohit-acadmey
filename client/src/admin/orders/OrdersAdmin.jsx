import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import API from "../../services/api";

function OrdersAdmin() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     📦 FETCH ORDERS
  ============================== */
  const fetchOrders = async () => {
    try {

      setLoading(true);
      setError("");

      const res = await API.get("/admin/orders");

      const data = res.data?.data || res.data || [];

      // ✅ latest first
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);

    } catch (err) {

      console.error(err);
      setError("Failed to load orders");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===============================
     🎨 STATUS UI
  ============================== */
  const getStatusUI = (status) => {

    switch (status) {

      case "paid":
      case "Paid":
        return {
          icon: <CheckCircle size={18} className="text-green-600" />,
          text: "Paid",
          color: "text-green-600"
        };

      case "pending":
      case "Pending":
        return {
          icon: <Clock size={18} className="text-yellow-600" />,
          text: "Pending",
          color: "text-yellow-600"
        };

      default:
        return {
          icon: <XCircle size={18} className="text-red-600" />,
          text: "Failed",
          color: "text-red-600"
        };
    }
  };

  /* 💰 FORMAT */
  const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  /* ⏳ LOADING */
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (

    <div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          Orders Management
        </h1>

        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Refresh
        </button>

      </div>

      {/* ❌ ERROR */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center text-sm">
          {error}
        </div>
      )}

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          No orders found
        </div>
      ) : (

        <>
          {/* 💻 DESKTOP */}
          <div className="hidden md:block bg-white shadow rounded-xl overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Material</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => {

                  const status = getStatusUI(order.status);

                  return (

                    <tr key={order._id} className="border-b hover:bg-gray-50">

                      <td className="p-3 font-semibold">
                        {order.orderId || order._id}
                      </td>

                      <td className="p-3">
                        {order.user?.name || "User"} <br />
                        <span className="text-xs text-gray-500">
                          {order.user?.phone}
                        </span>
                      </td>

                      <td className="p-3">
                        {order.materials?.length || 1} items
                      </td>

                      <td className="p-3 font-semibold text-blue-600">
                        {formatPrice(order.amount)}
                      </td>

                      <td className={`p-3 flex items-center gap-2 ${status.color}`}>
                        {status.icon} {status.text}
                      </td>

                      <td className="p-3 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

          {/* 📱 MOBILE */}
          <div className="grid gap-4 md:hidden">

            {orders.map((order) => {

              const status = getStatusUI(order.status);

              return (

                <div
                  key={order._id}
                  className="bg-white shadow rounded-xl p-4 space-y-2"
                >

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-600">
                      {order.orderId || order._id}
                    </span>

                    <span className={`flex items-center gap-1 text-sm ${status.color}`}>
                      {status.icon} {status.text}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">
                      {order.user?.name || "User"}
                    </span>
                    {" • "}
                    {order.user?.phone}
                  </div>

                  <div className="text-sm text-gray-700">
                    {order.materials?.length || 1} items
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-blue-600">
                      {formatPrice(order.amount)}
                    </span>

                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                </div>

              );

            })}

          </div>

        </>
      )}

    </div>

  );

}

export default OrdersAdmin;