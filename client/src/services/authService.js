import API from "./api";

/* =====================================
   📲 SEND OTP
===================================== */
export const sendOtp = async (phone) => {
  try {
    const { data } = await API.post("/otp/send", { phone });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to send OTP" };
  }
};

/* =====================================
   🔢 VERIFY OTP
===================================== */
export const verifyOtp = async (phone, otp) => {
  try {
    const { data } = await API.post("/otp/verify", { phone, otp });
    return data;
  } catch (error) {
    throw error.response?.data || { message: "Invalid OTP" };
  }
};

/* =====================================
   📲 LOGIN WITH PHONE
===================================== */
export const loginWithPhone = async (phone) => {
  try {
    const { data } = await API.post("/auth/login-phone", { phone });

    return {
      token: data?.token,
      user: data?.user,
    };

  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

/* =====================================
   👤 GET PROFILE
===================================== */
export const getProfile = async () => {
  try {
    const { data } = await API.get("/auth/me");

    return data?.user; // ✅ FIXED

  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch profile" };
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

  // 🔥 optional: redirect safe
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }

  return true;
};