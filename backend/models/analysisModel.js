// models/analysisModel.js
const fs = require('fs').promises; // Use promises version for async/await
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { fileToGenerativePart } = require('../utils/fileHelper');  // Import helper

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeImage = async (file) => {
   try {
      const promptData = await fs.readFile("./prompt.json", "utf8");
      const promptText = JSON.parse(promptData);

      const AnalysisModel = genAI.getGenerativeModel({
         model: "gemini-2.0-flash",
         systemInstruction: promptText["system_instructions"]
      }, { apiVersion: "v1beta" });

      const imageData = fileToGenerativePart(file.path, file.mimetype);

      const response = await AnalysisModel.generateContent({
         contents: [{ role: "user", parts: [{ text: promptText["system_prompt"] }, imageData] }],
         generationConfig: { maxOutputTokens: 8192, temperature: 0.5 }
      });

      let responseText = response.response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      responseText = responseText.replace(/```/g, "").replace('json', "");

      let structuredResponse;
      try {
         structuredResponse = JSON.parse(responseText);
      } catch (parseError) {
         console.error("Error parsing JSON:", parseError);
         throw new Error("Invalid JSON response from Gemini"); // Or handle differently
      }

      const finalResponse = {
         product_name: structuredResponse["product_name"] || "Unknown",
         product_category: structuredResponse["product_category"] || "Unknown",
         estimated_carbon_footprint_kgCO2: structuredResponse["estimated_carbon_footprint_kgCO2"] || 0,
         water_usage_liters: structuredResponse["water_usage_liters"] || 0,
         recyclability: {
            is_recyclable: structuredResponse["recyclability"]?.["is_recyclable"] || false,
            recycled_content_percentage: structuredResponse["recyclability"]?.["recycled_content_percentage"] || 0,
            recycling_instructions: structuredResponse["recyclability"]?.["recycling_instructions"] || "No instructions available"
         },
         materials: {
            primary_material: structuredResponse.materials?.["primary_material"] || "Unknown",
            sustainable_materials_percentage: structuredResponse["materials"]?.["sustainable_materials_percentage"] || 0,
            biodegradable: structuredResponse.materials?.["biodegradable"] || false
         },
         sustainability_score: structuredResponse["sustainability_score"] || 0,
         improvement_suggestions: structuredResponse["improvement_suggestions"] || [],
         confidence_score: structuredResponse["confidence_score"] || 0
      };

      await fs.unlink(file.path); // Delete the file after processing
      return finalResponse;

   } catch (error) {
      // Centralized error handling (including file cleanup)
      if (file) {
         try {
            await fs.unlink(file.path); // Attempt to delete the file
         } catch (unlinkError) {
            console.error("Error deleting file:", unlinkError); // Log any file deletion errors
         }
      }
      console.error("Error in analyzeImage:", error);
      throw error; // Re-throw the error for the controller to handle
   }
};