// utils/fileHelper.js
const fs = require("fs");

function fileToGenerativePart(path, mimeType) {
   try {
      return {
         inlineData: {
            data: fs.readFileSync(path).toString("base64"),
            mimeType,
         },
      };
   } catch (error) {
      console.error("Error reading file in fileToGenerativePart:", error);
      throw error; // Re-throw the error
   }
}

module.exports = { fileToGenerativePart };
