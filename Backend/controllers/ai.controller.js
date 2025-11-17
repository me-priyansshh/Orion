import main from "../Services/chat.service.js";
import fetch from "node-fetch";
import FormData from "form-data";
import { Buffer } from "buffer";


export const chatController = async (req, res) => {
    try {

        const { prompt, model } = req.body;

        const response = await main({ prompt , model });

       res.status(200).send({
        response ,
       });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error chatting"
        });
    }
}

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
