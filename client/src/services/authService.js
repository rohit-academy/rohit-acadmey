import API from "./api";

/* =====================================
   📲 SEND OTP
===================================== */
export const sendOtp = async (phone) => {
  const res = await API.post("/otp/send", { phone });
  return res.data;
};

/* =====================================
   🔢 VERIFY OTP
===================================== */
export const verifyOtp = async (phone, otp) => {
  const res = await API.post("/otp/verify", { phone, otp });
  return res.data;
};

/* =====================================
   📲 LOGIN WITH PHONE (GET TOKEN)
===================================== */
export const loginWithPhone = async (phone) => {
  const res = await API.post("/auth/login-phone", { phone });
  return res.data; // 🔥 return clean data
};

/* =====================================
   👤 GET CURRENT USER
===================================== */
export const getProfile = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

/* =====================================
   🔵 GOOGLE LOGIN (REDIRECT)
===================================== */
export const loginWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

/* =====================================
   🚪 LOGOUT
===================================== */
export const logoutUser = () => {

  /* 🔥 CLEAN ALL AUTH DATA */
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("admin");

  return true;
};