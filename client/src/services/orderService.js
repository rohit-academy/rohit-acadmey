import API from "./api";

// 🛒 Create order (after checkout form)
export const createOrder = (orderData) => {
  return API.post("/orders", orderData);
};

// 💳 Verify payment (after gateway success)
export const verifyPayment = (paymentData) => {
  return API.post("/orders/verify-payment", paymentData);
};

// 📜 Get logged-in user's orders
export const getMyOrders = () => {
  return API.get("/orders/my");
};

// 📦 Get single order details
export const getOrderById = (id) => {
  return API.get(`/orders/${id}`);
};

// ❌ Cancel order
export const cancelOrder = (id) => {
  return API.put(`/orders/${id}/cancel`);
};
