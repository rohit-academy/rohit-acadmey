import admin from "firebase-admin";
import fs from "fs";

let serviceAccount;

try {
  if (process.env.NODE_ENV === "production") {
    // 🔥 Render Secret File
    serviceAccount = JSON.parse(
      fs.readFileSync("/etc/secrets/serviceAccount.json", "utf8")
    );
  } else {
    // 💻 Local Development
    serviceAccount = JSON.parse(
      fs.readFileSync("./config/serviceAccount.json", "utf8")
    );
  }

  /* 🔥 DEBUG */
  console.log("🔥 NODE_ENV:", process.env.NODE_ENV);
  console.log("🔥 FIREBASE PROJECT:", serviceAccount.project_id);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

} catch (error) {
  console.error("🔥 Firebase Admin Init Error:", error.message);
}

export default admin;