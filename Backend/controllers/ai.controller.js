import main from "../Services/chat.service.js";
import fetch from "node-fetch";
import FormData from "form-data";
import { Buffer } from "buffer";
import { indexPDF } from "../Services/RAG.service.js";
import { queryPDF } from "../Services/RAG.service.js";
import { pineconeIndex } from "../Services/RAG.service.js";

export const chatController = async (req, res) => {
  try {
    const { prompt, model } = req.body;

    const response = await main({ prompt, model });

    res.status(200).send({
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error chatting",
    });
  }
};

export const generateImageController = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const form = new FormData();
    form.append("prompt", prompt);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      body: form,
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "Image generation failed" });
    }

    // ClipDrop returns image as ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Convert to Base64 for frontend
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    return res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const ragController = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const docs = indexPDF(file);

    res.status(200).send({
      message: "File indexed successfully",
      docs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in RAG controller",
    });
  }
};

export const pdfChatController = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt required" });
    }

    const answer = await queryPDF(prompt);

    if (!answer) {
      return res.status(404).json({ message: "Ask Valid Question" });
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in PDF chat" });
  }
};

export const clearRagController = async (req, res) => {
  try {
    await pineconeIndex.deleteAll();
    res.status(200).json({ message: "PDF Removed Successfully" });
  } catch (error) {
    console.error("Error clearing RAG:", error);
    res.status(500).json({ message: "Error clearing RAG" });
  }
};
