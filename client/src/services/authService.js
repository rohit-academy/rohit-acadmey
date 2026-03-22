import API from "./api";

/* =====================================
   📲 SEND OTP
===================================== */
export const sendOtp = (phone) => {
  return API.post("/otp/send", { phone });
};

/* =====================================
   🔢 VERIFY OTP + LOGIN
===================================== */
export const verifyOtp = (phone, otp) => {
  return API.post("/otp/verify", { phone, otp });
};

/* =====================================
   📲 LOGIN WITH PHONE (AFTER VERIFY)
===================================== */
export const loginWithPhone = (phone) => {
  return API.post("/auth/login-phone", { phone });
};

/* =====================================
   👤 GET PROFILE
===================================== */
export const getProfile = () => {
  return API.get("/auth/me");
};

/* =====================================
   🚪 LOGOUT (FRONTEND TOKEN REMOVE)
===================================== */
export const logoutUser = () => {
  localStorage.removeItem("token");
  return Promise.resolve();
};