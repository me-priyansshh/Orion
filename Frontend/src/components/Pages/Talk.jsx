import React, { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const Talk = () => {
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const navigate = useNavigate();

  let recognition;
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
  }

  const handleMic = () => {
    if (!recognition) return alert("Browser does not support mic access");

    setListening(true);
    setUserText("");
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserText(transcript);
      sendToBackend(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  const sendToBackend = async (text) => {
    try {
      const res = await axios.post("/voice", {
        prompt: text,
      });

       const audio = new Audio(`${import.meta.env.VITE_BACKEND_URL}/${res.data.audioUrl}`);
       audio.play();

    } catch (err) {
      console.error("Voice API error:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #0f0c29, #302b63, #24243e)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#00eaff",
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* Robot GIF */}
      <img
        src="https://i.gifer.com/7VE.gif"
        alt="robot-listening"
        style={{
          width: "160px",
          height: "160px",
          marginBottom: "20px",
          filter: "drop-shadow(0 0 12px #00eaffaa)",
        }}
      />

      {/* Status */}
      <h2
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "1.6rem",
          textShadow: "0 0 10px #00eaff",
          marginBottom: "10px",
        }}
      >
        {listening ? "Listening..." : "Tap the mic & speak"}
      </h2>

      {userText && (
        <p
          style={{
            marginTop: "8px",
            color: "#c6f7ff",
            fontSize: "1rem",
            maxWidth: "80%",
          }}
        >
          You said: <strong>{userText}</strong>
        </p>
      )}

      {/* Mic Circle */}
      <div
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          border: "2px solid #00eaff66",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: listening ? "pulseRing 2.5s infinite ease-out" : "none",
          marginTop: "12px",
          marginBottom: "22px",
        }}
      >
        <div
          onClick={handleMic}
          style={{
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            background: listening
              ? "linear-gradient(135deg,#ff2e63,#b84aff)"
              : "linear-gradient(135deg,#00eaff,#b84aff)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: listening
              ? "0 0 25px #ff2e63aa"
              : "0 0 20px #00eaffaa",
            cursor: "pointer",
            transition: "0.3s",
            fontSize: "38px",
            color: "#0d0d0d",
            userSelect: "none",
          }}
        >
          🎙️
        </div>
      </div>

      {/* Chat Button */}
      <button
        onClick={() => navigate("/home/explore")}
        style={{
          position: "fixed",
          right: "380px",
          bottom: "280px",
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
          Chat
        </span>
      </button>

      {/* Animations */}
      <style>
        {`
          @keyframes pulseRing {
            0% { transform: scale(0.85); opacity: 0.6; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.85); opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};

export default Talk;
