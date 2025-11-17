import React, { useState } from "react";
import axios from "../../utils/axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const CreateImage = () => {

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState(null);
  const navigate = useNavigate();


  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setProgress(0);
    setGeneratedImage(null);

    // Smooth progress bar animation
    let p = 0;
    const fakeProgress = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 90) clearInterval(fakeProgress);
    }, 50);

    try {
      const res = await axios.post("/ai/image", { prompt });
      if (res.data.success) {
        setProgress(100);
        setGeneratedImage(res.data.image);
        setPrompt("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 py-10 gap-8 ">

      {/* IMAGE DISPLAY BOX */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl h-90 bg-black/40 border border-cyan-400/30 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.15)] flex items-center justify-center overflow-hidden"
      >
        {generatedImage ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            src={generatedImage}
            alt="Generated"
            className="w-full h-full object-contain rounded-2xl"
          />
        ) : (
          <p className="text-cyan-300 text-lg opacity-60">
           🤖 Orion Is Best 🤖
          </p>
        )}
      </motion.div>

      {/* PROMPT + BUTTON CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#0b0f14] border border-cyan-400/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,255,255,0.15)]"
      >
        <h1 className="text-cyan-300 text-3xl font-bold mb-4 text-center drop-shadow-[0_0_6px_cyan]">
          Shape Your Thoughts
        </h1>

        {/* INPUT */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          className="w-full bg-black/40 text-white border border-white/20 rounded-xl p-3 focus:ring-2 focus:ring-cyan-400 outline-none text-lg mb-4"
        />

        {/* PROGRESS BAR */}
        {loading && (
          <div className="w-full h-2 bg-white/10 rounded-xl overflow-hidden mb-4">
            <motion.div
              className="h-full bg-cyan-400"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </div>
        )}

        {/* Floating Talk Button */}
      <button
        style={{
          position: "fixed",
          right: "350px",
          bottom: "492px",
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

      {/* Floating Chat Button */}
      <button
        style={{
          position: "fixed",
          right: "350px",
          bottom: "192px",
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
        onClick={() => navigate("/home/explore")}
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
          Chat 🤖
        </span>
      </button>


        {/* BUTTON */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3 font-semibold text-lg rounded-xl text-black bg-cyan-300 shadow-[0_0_15px_cyan] transition-all 
            ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-cyan-200"}`}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </motion.div>
    </div>
  );
};

export default CreateImage;
