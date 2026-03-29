import admin from "firebase-admin";
import fs from "fs";

let serviceAccount;

try {
  console.log("🔥 NODE_ENV:", process.env.NODE_ENV);

  /* =====================================
     🔥 LOAD SERVICE ACCOUNT
  ===================================== */

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // ✅ BEST (ENV METHOD)
    console.log("📦 Using ENV Firebase Config");

    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  } else {
    // 📁 FILE METHOD
    const filePath =
      process.env.NODE_ENV === "production"
        ? "/etc/secrets/serviceAccount.json"
        : "./config/serviceAccount.json";

    console.log("📂 Reading file from:", filePath);

    const fileData = fs.readFileSync(filePath, "utf8");
    serviceAccount = JSON.parse(fileData);

    console.log("✅ File loaded successfully");
  }

  console.log("🔥 FIREBASE PROJECT:", serviceAccount.project_id);

  /* =====================================
     🚀 INIT FIREBASE ADMIN
  ===================================== */

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("🚀 Firebase Admin Initialized");
  }

} catch (error) {
  console.error("🔥 Firebase Admin Init Error FULL:", error);
}

export default admin;