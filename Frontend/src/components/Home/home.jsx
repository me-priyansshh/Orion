import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./rightSidebar";

const Home = () => {
  return (
    <div className="flex w-full h-screen bg-[#0d0d0d] text-white overflow-hidden">
      {/* Left Sidebar (fixed width) */}
      <LeftSidebar />

      {/* Middle Content Area */}
      <div
        className="w-[60%] h-[99vh] overflow-y-auto p-6"
        style={{
          backgroundColor: "#111111",
          boxShadow: "inset 6px 0 8px -2px #00fff7", // left neon glow
          scrollbarWidth: "none", // Firefox
        }}
      >
        {/* Hide scrollbar for Webkit browsers */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Outlet renders your child pages here */}
        <Outlet />
      </div>

      {/* Right Sidebar (separate component) */}
      <RightSidebar />
    </div>
  );
};

export default Home;
