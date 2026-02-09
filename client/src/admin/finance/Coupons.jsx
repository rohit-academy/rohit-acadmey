import React, { useState } from "react";
import { PlusCircle, Ticket, Calendar } from "lucide-react";

function Coupons() {
  const [coupons, setCoupons] = useState([
    {
      code: "WELCOME10",
      discount: 10,
      expiry: "30 Mar 2026",
      active: true
    },
    {
      code: "EXAM50",
      discount: 50,
      expiry: "10 Feb 2026",
      active: false
    }
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expiry: ""
  });

  const handleChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const addCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiry) return;

    setCoupons([
      ...coupons,
      { ...newCoupon, active: true }
    ]);

    setNewCoupon({ code: "", discount: "", expiry: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>

      {/* Add Coupon Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PlusCircle size={20} /> Create New Coupon
        </h2>

        <form onSubmit={addCoupon} className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            name="code"
            placeholder="Coupon Code"
            value={newCoupon.code}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount %"
            value={newCoupon.discount}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <input
            type="date"
            name="expiry"
            value={newCoupon.expiry}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          <button className="bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition">
            Add Coupon
          </button>
        </form>
      </div>

      {/* Coupon Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <Ticket size={18} className="text-purple-600" />
                  {coupon.code}
                </td>
                <td className="p-3 font-semibold text-green-600">
                  {coupon.discount}% OFF
                </td>
                <td className="p-3 flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  {coupon.expiry}
                </td>
                <td className="p-3">
                  {coupon.active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Expired</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Coupons;
