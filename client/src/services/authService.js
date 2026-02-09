import API from "./api";

// 📲 Step 1: Send OTP to phone
export const sendOtp = (phone) => {
  return API.post("/auth/send-otp", { phone });
};

// 🔢 Step 2: Verify OTP
export const verifyOtp = (phone, otp) => {
  return API.post("/auth/verify-otp", { phone, otp });
};

// 👤 Get logged-in user profile
export const getProfile = () => {
  return API.get("/auth/profile");
};

// 🚪 Logout (optional backend call)
export const logoutUser = () => {
  return API.post("/auth/logout");
};
