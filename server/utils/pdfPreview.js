import { exec } from "child_process";
import path from "path";

export const generatePreview = (pdfPath, outputFolder) => {

  return new Promise((resolve, reject) => {

    const command = `pdftoppm -jpeg -f 1 -l 2 "${pdfPath}" ${outputFolder}/preview`;

    exec(command, (err) => {

      if (err) reject(err);
      else resolve();

    });

  });

};