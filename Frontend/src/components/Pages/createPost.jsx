import React, { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";
import { setPosts } from "../../Redux/postSlice";

const Create = () => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("post"); // "post" or "story"
  const [uploading, setUploading] = useState(false); // track uploading state
  const [progress, setProgress] = useState(0); // optional progress percentage

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postt } = useSelector((store) => store.post);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("file", file);

      const res = await axios.post(`/api/post/addPost`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });
      console.log(res.data.post);
      toast.success(res.data.message);
      setCaption("");
      setFile(null);
      navigate("/home");
      dispatch(setPosts([...postt, res.data.post]));
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div
      style={{
        minHeight: "91vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "linear-gradient(135deg, #0d0d0d, #111111)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#111",
          padding: "24px",
          borderRadius: "30px",
          boxShadow: "0 0 20px rgba(0, 255, 247, 0.125)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#00fff7",
            textAlign: "center",
            textShadow: "0 0 10px #00fff7",
          }}
        >
          Create Something Awesome
        </h2>
        <p style={{ color: "#aaa", textAlign: "center" }}>
          Share your thoughts with the world! Upload a post or a story.
        </p>

        {/* Type Selector */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => setType("post")}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              fontWeight: "600",
              backgroundColor: type === "post" ? "#00fff7" : "#222",
              color: type === "post" ? "#000" : "#ccc",
              boxShadow: type === "post" ? "0 0 10px #00fff7" : "none",
              cursor: "pointer",
            }}
            disabled={uploading}
          >
            Post
          </button>
          <button
            type="button"
            onClick={() => setType("story")}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              fontWeight: "600",
              backgroundColor: type === "story" ? "#00fff7" : "#222",
              color: type === "story" ? "#000" : "#ccc",
              boxShadow: type === "story" ? "0 0 10px #00fff7" : "none",
              cursor: "pointer",
            }}
            disabled={uploading}
          >
            Story
          </button>
        </div>

        {/* File Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ccc", fontWeight: "500" }}>Upload File</label>
          <input
            type="file"
            accept={type === "post" ? "image/*,video/*" : "image/*"}
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
            style={{
              padding: "8px",
              borderRadius: "12px",
              background: "#222",
              color: "#eee",
            }}
          />
        </div>

        {/* Caption Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ color: "#ccc", fontWeight: "500" }}>Caption</label>
          <input
            type="text"
            placeholder={`Add a caption for your ${type}...`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={uploading}
            style={{
              padding: "8px",
              borderRadius: "12px",
              background: "#222",
              color: "#eee",
              outline: "none",
            }}
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div style={{ color: "#00fff7", textAlign: "center" }}>
            Uploading... {progress}%
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          style={{
            padding: "12px",
            backgroundColor: uploading ? "#555" : "#00fff7",
            color: uploading ? "#ccc" : "#000",
            fontWeight: "bold",
            borderRadius: "20px",
            boxShadow: uploading ? "none" : "0 0 15px #00fff7",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Uploading..." : `Upload ${type === "post" ? "Post" : "Story"}`}
        </button>

        {/* Aesthetic text */}
        <p style={{ textAlign: "center", color: "#777", fontSize: "0.85rem" }}>
          Share your creativity, inspire others, and make your mark in the digital world ✨
        </p>
      </form>
    </div>
  );
};

export default Create;
