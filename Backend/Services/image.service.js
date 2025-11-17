/* import { GoogleGenAI } from "@google/genai";

import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export async function generateImages(prompt) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateImages({
    model: "imagen-4.0-generate-001",
    prompt: prompt,
    config: {
      numberOfImages: 4,
    },
  });

  // Ensure uploads folder exists
  const uploadDir = path.join("uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const savedImages = [];

  let idx = 1;
  for (const generatedImage of response.generatedImages) {
    const imgBytes = generatedImage.image.imageBytes;
    const buffer = Buffer.from(imgBytes, "base64");
    const fileName = `imagen-${Date.now()}-${idx}.png`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    savedImages.push(`/uploads/${fileName}`); // URL relative to express.static
    idx++;
  }

  return savedImages; // return array of URLs
}
 */

