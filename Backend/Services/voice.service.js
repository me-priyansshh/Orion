import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import wav from "wav";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function saveWaveFile(filename, pcmData) {
  return new Promise((resolve, reject) => {
    const writer = new wav.FileWriter(filename, { channels: 1, sampleRate: 24000, bitDepth: 16 });
    writer.on("finish", resolve);
    writer.on("error", reject);
    writer.write(pcmData);
    writer.end();
  });
}

export const generateSpeechController = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Step 1: Generate AI text response
    const chatResponse = await ai.models.generateContent({
      model: "gemini-2.5", // chat model
      contents: [{ parts: [{ text: prompt }] }]
    });
    const aiText = chatResponse.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) return res.status(500).json({ error: "No AI response" });

    // Step 2: Convert AI text to speech
    const ttsResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts", // TTS model
      contents: [{ parts: [{ text: aiText }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
      }
    });

    const audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) return res.status(500).json({ error: "No TTS audio generated" });

    const audioBuffer = Buffer.from(audioData, "base64");

    // Step 3: Save audio
    if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
    const fileName = `audio_${Date.now()}.wav`;
    const filePath = path.join("uploads", fileName);
    await saveWaveFile(filePath, audioBuffer);

    res.status(200).json({ success: true, audioUrl: `/uploads/${fileName}` });
  } catch (err) {
    console.error("AI TTS ERROR:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
