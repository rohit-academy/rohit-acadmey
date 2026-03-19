import { exec } from "child_process";
import fs from "fs";

export const generatePreview = (pdfPath, outputFolder) => {

  return new Promise((resolve) => {

    const command = `pdftoppm -jpeg -f 1 -l 2 "${pdfPath}" ${outputFolder}/preview`;

    exec(command, (err, stdout, stderr) => {

      if (err) {

        console.log("❌ Preview generation failed");
        console.log("Reason:", err.message);

        // 🔥 IMPORTANT: reject नहीं करना → crash रोकना
        return resolve(null);

      }

      // ✅ check if files actually created
      const preview1 = `${outputFolder}/preview-1.jpg`;
      const preview2 = `${outputFolder}/preview-2.jpg`;

      if (!fs.existsSync(preview1) && !fs.existsSync(preview2)) {

        console.log("⚠️ Preview files not generated");
        return resolve(null);

      }

      console.log("✅ Preview generated successfully");
      resolve(true);

    });

  });

};