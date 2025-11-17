import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios.js";
import toast from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { setAuthUser } from "../../Redux/authSlice.js";

const Login = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`/api/user/login`, {
        userName: formData.userName,
        password: formData.password,
      });
      console.log(res.data);
      dispatch(setAuthUser(res.data.user));
      toast.success(res.data.message);
      setFormData({
        userName: "",
        password: "",
      });
      navigate("/home");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
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
              textShadow:
                "0 0 8px #00f0ff, 0 0 15px #00c8ff, 0 0 25px #009fff",
            }}
          >
            Welcome Back
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

          {/* Login Button with Spinner */}
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
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* No account? Register */}
          <div className="text-center mt-3">
            <span style={{ color: "#fff", fontWeight: "bold" }}>
              Create Account?{" "}
            </span>
            <span
              style={{
                color: "#00bfff",
                fontWeight: "bold",
                textShadow: "0 0 8px #00e0ff, 0 0 15px #00bfff",
                cursor: "pointer",
              }}
              onClick={() => navigate("/signup")}
            >
              Register
            </span>
          </div>

          {/* Optional Quote */}
          <p
            className="text-white text-lg font-bold mt-4 text-center max-w-xs mx-auto"
            style={{
              letterSpacing: "0.5px",
              lineHeight: "1.5rem",
              textShadow:
                "0 0 5px #ff69b4, 0 0 10px #ff1493, 0 0 15px #ff69b4",
              opacity: visible ? 1 : 0,
              transition: "opacity 1.5s ease-in-out 0.5s",
            }}
          >
            <span style={{ color: "#ff0000" }}>M</span>aybe{" "}
            <span style={{ color: "#ff0000" }}>i</span>n{" "}
            <span style={{ color: "#ff0000" }}>A</span>nother{" "}
            <span style={{ color: "#ff0000" }}>D</span>imension{" "}
            <span style={{ color: "#ff0000" }}>Y</span>ou{" "}
            <span style={{ color: "#ff0000" }}>A</span>nd{" "}
            <span style={{ color: "#ff0000" }}>I</span> ❤️
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
