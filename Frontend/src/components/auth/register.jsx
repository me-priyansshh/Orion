import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import toast from "react-hot-toast";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Delay the fade-in of the entire page content
    const timer = setTimeout(() => {
      setVisible(true);
    }, 50); // delay in ms
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      setloading(true);
      e.preventDefault();
      const res = await axios.post(`/api/user/register`, {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      });
      console.log(res.data);
      navigate("/login");
      toast.success(res.data.message);
      setFormData({
        userName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1431440869543-efaf3388c585?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#0e0f13",
        color: "#fff",
      }}
    >
      {/* Wrapper for fade-in */}
      <div
        className="transition-opacity duration-1500"
        style={{
          opacity: visible ? 1 : 0,
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md p-10 rounded-xl shadow-2xl w-96 flex flex-col gap-6"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <h2
            className="text-3xl font-extrabold text-center mb-4"
            style={{
              textShadow: "0 0 8px #00f0ff, 0 0 15px #00c8ff, 0 0 25px #009fff",
            }}
          >
            Create Account
          </h2>

          {/* Username */}
          <div className="flex flex-col">
            <label className="mb-2">Username</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
              style={{
                backgroundColor: "#1a1a1a",
                boxShadow: "0 0 5px rgba(0,200,255,0.5)",
              }}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
              style={{
                backgroundColor: "#1a1a1a",
                boxShadow: "0 0 5px rgba(0,200,255,0.5)",
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="p-3 rounded-lg text-white placeholder-gray-400 focus:outline-none"
              style={{
                backgroundColor: "#1a1a1a",
                boxShadow: "0 0 5px rgba(0,200,255,0.5)",
              }}
            />
          </div>

          {/* Register Button */}
          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? "#0090cc" : "#00bfff",
              color: "#E6E6FA",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "9999px",
              padding: "12px 30px",
              boxShadow: loading
                ? "0 0 6px #00bfff, 0 0 15px #00e0ff"
                : "0 0 3px #00bfff, 0 0 6px #00e0ff, 0 0 10px #009fff",
              textShadow: "0 0 1px #fff, 0 0 2px #fff",
              transition: "all 0.3s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.boxShadow =
                  "0 0 1px #00bfff, 0 0 10px #00e0ff, 0 0 15px #009fff";
            }}
            onMouseLeave={(e) => {
              if (!loading)
                e.currentTarget.style.boxShadow =
                  "0 0 3px #00bfff, 0 0 6px #00e0ff, 0 0 10px #009fff";
            }}
          >
            {loading ? (
              <>
                <span
                  className="animate-spin"
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "3px solid #fff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                  }}
                ></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          {/* Already a user? Login */}
          <div className="text-center mt-3">
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              Already a user?{" "}
            </span>
            <span
              style={{
                color: "#00bfff",
                fontWeight: "bold",
                textShadow: "0 0 8px #00e0ff, 0 0 15px #00bfff",
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>

          {/* Quote about love */}
          <p
            className="text-white text-lg font-bold mt-4 text-center max-w-xs mx-auto"
            style={{
              letterSpacing: "0.5px",
              lineHeight: "1.5rem",
              textShadow: "0 0 5px #ff69b4, 0 0 10px #ff1493, 0 0 15px #ff69b4",
            }}
          >
            <span style={{ color: "#ff0000" }}>L</span>ove{" "}
            <span style={{ color: "#ff0000" }}>i</span>s{" "}
            <span style={{ color: "#ff0000" }}>t</span>he{" "}
            <span style={{ color: "#ff0000" }}>k</span>ey{" "}
            <span style={{ color: "#ff0000" }}>t</span>o{" "}
            <span style={{ color: "#ff0000" }}>e</span>very{" "}
            <span style={{ color: "#ff0000" }}>h</span>eart
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
