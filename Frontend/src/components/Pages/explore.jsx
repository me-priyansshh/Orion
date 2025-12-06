// src/pages/OrionAI.jsx
import { Atom } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaFilePdf, FaCloudUploadAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const OrionAI = () => {
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [uploadName, setUploadName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPDFUploaded, setIsPDFUploaded] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setUploadName(f.name);
      toast.success("PDF uploaded successfully!");
      const formData = new FormData();
      formData.append("file", f);
      await axios.post("/rag/pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsPDFUploaded(true);
    }
  };

  const models = [
    "openai/gpt-oss-120b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "moonshotai/kimi-k2-instruct",
  ];

  // auto-scroll to latest message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const prompt = input;
    const userMsg = { sender: "You", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // temporary thinking message
    const thinkingMsg = { sender: "Orion", text: "Thinking...", temp: true };
    setMessages((prev) => [...prev, thinkingMsg]);

    if (isPDFUploaded) {
      try {
        const res = await axios.post("/pdf/chat", { prompt });
        setMessages((prev) =>
          prev
            .filter((m) => !m.temp)
            .concat({
              sender: "Orion",
              text: res.data?.answer || "Not Found in PDF 🐞",
            })
        );
      } catch (err) {
        console.error(err);
        toast.error("Server error. Please try again later.");
        setMessages((prev) =>
          prev
            .filter((m) => !m.temp)
            .concat({
              sender: "Orion",
              text: "Server error. Please try again later.",
            })
        );
      }
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/ai", {
        prompt,
        model,
      });

      setMessages((prev) =>
        prev
          .filter((m) => !m.temp)
          .concat({
            sender: "Orion",
            text: res.data?.response || "Sorry, no response.",
          })
      );
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
      setMessages((prev) =>
        prev
          .filter((m) => !m.temp)
          .concat({
            sender: "Orion",
            text: "Server error. Please try again later.",
          })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePDF = async () => {
    try {
      const res = await axios.delete("/rag/clear");
      toast.success(res.data.message);
      setIsPDFUploaded(false);
      setUploadName("");
    } catch (error) {
      console.error("Error removing PDF:", error);
      toast.error("Error removing PDF");
    }
  };

  return (
    <div
      style={{
        minHeight: "92vh",
        background:
          "radial-gradient(circle at top left, #0f0c29, #302b63, #24243e)",
        color: "#00eaff",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Atom style={{ color: "#00eaff", fontSize: "26px" }} />
          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "1.6rem",
              margin: 0,
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            ORION <span style={{ color: "#ff00d4" }}>AI</span>
            {isPDFUploaded && (
              <span
                style={{
                  marginLeft: "10px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "rgba(0, 234, 255, 0.15)",
                  border: "1px solid #00eaff55",
                  color: "#00eaff",
                  fontSize: "0.75rem",
                  fontFamily: "'Poppins', sans-serif",
                  textShadow: "0 0 4px #00eaff88",
                }}
              >
                PDF MODE ON
              </span>
            )}
          </h1>
        </div>

        {/* glowing dropdown */}
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            color: "#00eaff",
            border: "1px solid #00eaff88",
            padding: "8px 12px",
            borderRadius: "10px",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "0.85rem",
            outline: "none",
            cursor: "pointer",
            boxShadow: "0 0 12px #00eaff44",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.target.style.boxShadow = "0 0 18px #00eaffaa")
          }
          onMouseLeave={(e) =>
            (e.target.style.boxShadow = "0 0 12px #00eaff44")
          }
        >
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Floating Talk Button */}
      <button
        style={{
          position: "fixed",
          right: "620px",
          bottom: "592px",
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00eaff, #b84aff)",
          border: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          boxShadow: "0 0 18px #00eaff77",
          transition: "0.3s",
          zIndex: 9999,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onClick={() => navigate("/home/talk")}
        aria-label="Open voice chat"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
          alt="robot"
          style={{
            width: "32px",
            height: "32px",
            filter: "drop-shadow(0 0 4px #ffffff88)",
          }}
        />
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: "600",
            color: "#0d0d0d",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          Talk
        </span>
      </button>

      {/* Floating Image Button */}
      <button
        style={{
          position: "fixed",
          right: "720px",
          bottom: "592px",
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00eaff, #b84aff)",
          border: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
          cursor: "pointer",
          boxShadow: "0 0 18px #00eaff77",
          transition: "0.3s",
          zIndex: 9999,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onClick={() => navigate("/home/image")}
        aria-label="Open voice chat"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
          alt="robot"
          style={{
            width: "32px",
            height: "32px",
            filter: "drop-shadow(0 0 4px #ffffff88)",
          }}
        />
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: "600",
            color: "#0d0d0d",
            fontFamily: "'Orbitron', sans-serif",
          }}
        >
          Image
        </span>
      </button>

      {/* Chat Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid #00eaff33",
          borderRadius: "14px",
          padding: "18px",
          boxShadow: "0 0 18px #00eaff33",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "1.2rem",
              color: "#00eaffaa",
              textShadow: "0 0 8px #00eaff",
              animation: "fadeIn 2s ease",
            }}
          >
            💬 Talk to{" "}
            <span style={{ color: "#ff00d4", marginLeft: "8px" }}>Orion</span>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "8px",
              marginBottom: "12px",
              scrollBehavior: "smooth",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    m.sender === "You" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    maxWidth: "72%",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    background:
                      m.sender === "You"
                        ? "linear-gradient(135deg,#00eaff,#b84aff)"
                        : "rgba(255,255,255,0.06)",
                    color: m.sender === "You" ? "#0d0d0d" : "#d1f7ff",
                    boxShadow:
                      m.sender === "You" ? "0 0 10px #00eaff77" : "none",
                    fontFamily:
                      m.sender === "Orion"
                        ? "'Dancing Script', cursive"
                        : "'Poppins', sans-serif",
                    fontSize: "1rem",
                    animation:
                      m.text === "Thinking..."
                        ? "pulse 1.5s infinite ease-in-out"
                        : "fadeIn 0.5s ease",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      color: m.sender === "You" ? "#002" : "#ffb6f0",
                    }}
                  >
                    {m.sender}
                  </strong>
                  <span>{m.text}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="text"
            placeholder="Ask Orion anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #00eaff33",
              background: "rgba(0,0,0,0.4)",
              color: "#00eaff",
              outline: "none",
              fontFamily: "'Poppins', sans-serif",
              transition: "0.3s",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={loading}
            aria-label="Chat input"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              background: loading
                ? "gray"
                : "linear-gradient(135deg,#00eaff,#b84aff)",
              color: "#0d0d0d",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              transition: "0.3s",
            }}
            aria-label="Send message"
          >
            {loading ? "..." : <FaPaperPlane />}
          </button>
        </div>

        {/* Tools (Create Image removed) */}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            alignItems: "center",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #00eaff55",
              background: "transparent",
              color: "#ff00d4",
              cursor: "pointer",
            }}
            onClick={() => handleRemovePDF()}
          >
            <FaFilePdf /> REMOVE PDF
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid #00eaff55",
              background: "transparent",
              color: "#00eaff",
              cursor: "pointer",
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              onChange={handleFile}
              style={{ display: "none" }}
            />
            <FaCloudUploadAlt /> {uploadName ? uploadName : "Upload PDF"}
          </label>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default OrionAI;
