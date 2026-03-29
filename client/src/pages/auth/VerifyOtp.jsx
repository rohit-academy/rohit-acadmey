const handleVerifyOtp = async (e) => {
  e.preventDefault();
  if (loading) return;

  try {
    setLoading(true);
    setError("");

    console.log("🚀 START OTP VERIFY");

    if (!window.confirmationResult) {
      console.log("❌ No confirmationResult");
      throw new Error("OTP expired. Try again.");
    }

    /* 🔥 VERIFY WITH FIREBASE */
    const result = await window.confirmationResult.confirm(otp);
    console.log("✅ Firebase confirm result:", result);

    const firebaseUser = result.user;
    console.log("👤 Firebase User:", firebaseUser);

    /* 🔥 GET TOKEN */
    const idToken = await firebaseUser.getIdToken();
    console.log("🔥 ID TOKEN:", idToken);

    /* 🔥 API URL CHECK */
    console.log("🌐 API URL:", import.meta.env.VITE_API_URL);

    /* 🔥 SEND TOKEN */
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/firebase-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: idToken
        })
      }
    );

    console.log("📡 RESPONSE STATUS:", res.status);

    const data = await res.json();
    console.log("📦 BACKEND RESPONSE:", data);

    if (!data?.token || !data?.user) {
      throw new Error(data?.message || "Login failed");
    }

    /* 🔥 LOGIN */
    login(data);
    console.log("✅ LOGIN SUCCESS");

    navigate(redirectPath, { replace: true });

  } catch (err) {
    console.error("❌ OTP Verify Error FULL:", err);
    setError(err.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};