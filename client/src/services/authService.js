import API from "./api";

/* =====================================
   🔧 GLOBAL ERROR HANDLER
===================================== */
const handleError = (error, fallback) => {
  throw error?.response?.data || { message: fallback };
};

/* =====================================
   📲 SEND OTP
===================================== */
export const sendOtp = async (phone) => {
  if (!/^[0-9]{10}$/.test(phone)) {
    throw { message: "Valid phone number required" };
  }

  try {
    const res = await API.post("/otp/send", { phone });
    return res.data;
  } catch (error) {
    handleError(error, "Failed to send OTP");
  }
};

/* =====================================
   🔢 VERIFY OTP
===================================== */
export const verifyOtp = async (phone, otp) => {
  if (!/^[0-9]{4,6}$/.test(otp)) {
    throw { message: "Invalid OTP format" };
  }

  try {
    const res = await API.post("/otp/verify", { phone, otp });
    return res.data;
  } catch (error) {
    handleError(error, "Invalid OTP");
  }
};

/* =====================================
   📲 LOGIN WITH PHONE
===================================== */
export const loginWithPhone = async (phone) => {
  if (!/^[0-9]{10}$/.test(phone)) {
    throw { message: "Valid phone number required" };
  }

  try {
    const res = await API.post("/auth/login-phone", { phone });

    return res.data; // ✅ consistent

  } catch (error) {
    handleError(error, "Login failed");
  }
};

/* =====================================
   👤 GET PROFILE
===================================== */
export const getProfile = async () => {
  try {
    const res = await API.get("/auth/me");

    return res.data?.data; // ✅ FIXED

  } catch (error) {
    handleError(error, "Failed to fetch profile");
  }
};

/* =====================================
   🔵 GOOGLE LOGIN
===================================== */
export const loginWithGoogle = () => {

  const API_URL = import.meta.env.VITE_API_URL;

  if (!API_URL) {
    console.error("❌ API URL missing");
    return;
  }

  window.location.href = `${API_URL}/auth/google`;
};

/* =====================================
   🚪 LOGOUT
===================================== */
export const logoutUser = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("admin");

  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }

  return true;
};