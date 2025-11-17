import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LandingPage = () => {

   const navigate = useNavigate();

   const handleLogin = () => {
      navigate('/login');
      toast.success('WELCOME');
   }

   const handleRegister = () => {
      navigate('/signup');
      toast.success('CREATE ACCOUNT');
   }

  return (
    <div
      className="relative w-full h-screen flex flex-col justify-center items-center text-center overflow-hidden"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1431440869543-efaf3388c585?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#0e0f13", // dark base
        color: "#ffffff",
      }}
    >
      {/* Title */}
      <h1 className="relative font-extrabold drop-shadow-lg" style={{ textTransform: "uppercase" }}>
        <span
          className="inline-block"
          style={{
            fontSize: "10rem",
            color: "#00e5d4", // electric teal for “O”
            textShadow:
              "0 0 15px #00e5d4, 0 0 30px #00c8b2, 0 0 45px #009f90",
          }}
        >
          O
        </span>
        <span
          className="inline-block ml-2 font-extrabold"
          style={{
            fontSize: "4.5rem",
            color: "#f0f0f0",
            letterSpacing: "0.12em",
          }}
        >
          RION
        </span>
      </h1>

      {/* Quote with every first letter glowing teal */}
      <p className="relative mt-6 text-lg md:text-xl font-semibold tracking-wide max-w-xl px-4">
        <span style={{ color: "#00e5d4", textShadow: "0 0 8px #00c8b2" }}>D</span>ie{' '}
        <span style={{ color: "#00e5d4", textShadow: "0 0 8px #00c8b2" }}>H</span>ölle{' '}
        <span style={{ color: "#00e5d4", textShadow: "0 0 8px #00c8b2" }}>i</span>st{' '}
        <span style={{ color: "#00e5d4", textShadow: "0 0 8px #00c8b2" }}>l</span>eer,{' '}
        <span style={{ color: "#00e5d4", textShadow: "0 0 8px #00c8b2" }}>a</span>lle{' '}
        <span style={{ color: "#00e5d4", textShadow: "0 0 8px #00c8b2" }}>T</span>eufel{' '}
        <span style={{ color: "#00e5d4", textShadow: "0 0 8px #00c8b2" }}>s</span>ind{' '}
        <span style={{ color: "#00e5d4", textShadow: "0 0 8px #00c8b2" }}>h</span>ier” – Shakespeare
      </p>

      {/* Buttons */}
      <div className="mt-12 flex gap-6 z-10">
        <button
          className="px-8 py-4 text-white font-bold rounded-full text-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          style={{
            background: "linear-gradient(to right, #00e5d4, #009f90)",
            boxShadow: "0 0 15px #00e5d4",
          }}
          onClick={handleRegister}
        >
          Get Started
        </button>
        <button
          className="px-8 py-4 border-2 border-white text-white font-bold rounded-full text-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          style={{
            background: "transparent",
          }}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
