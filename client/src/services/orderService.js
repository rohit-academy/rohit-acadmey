import API from "./api";

/* =====================================
   🛒 CREATE ORDER
===================================== */
export const createOrder = async (orderData) => {
  const res = await API.post("/orders", orderData);
  return res.data;
};

/* =====================================
   💳 VERIFY PAYMENT (RAZORPAY)
===================================== */
export const verifyPayment = async (paymentData) => {
  const res = await API.post("/orders/verify-payment", paymentData);
  return res.data;
};

/* =====================================
   📜 GET MY ORDERS
===================================== */
export const getMyOrders = async () => {
  const res = await API.get("/orders/my");
  return res.data?.data || res.data;
};

/* =====================================
   📦 GET ORDER BY ID
===================================== */
export const getOrderById = async (id) => {
  if (!id) throw new Error("Order ID required");

  const res = await API.get(`/orders/${id}`);
  return res.data?.data || res.data;
};

/* =====================================
   ❌ CANCEL ORDER
===================================== */
export const cancelOrder = async (id) => {
  if (!id) throw new Error("Order ID required");

  const res = await API.put(`/orders/${id}/cancel`);
  return res.data;
};

/* =====================================
   📥 DOWNLOAD MATERIALS (BONUS)
===================================== */
export const getMyDownloads = async () => {
  const res = await API.get("/orders/my-downloads");
  return res.data?.data || res.data;
};