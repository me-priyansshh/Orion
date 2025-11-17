import React from "react";
import toast from "react-hot-toast";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {
  AtomIcon,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
} from "lucide-react";
import "@fontsource/orbitron"; // futuristic font
import { Avatar } from "@radix-ui/react-avatar";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser, setSuggestedUsers, setUserProfile } from "../../Redux/authSlice";
import useGetAllPosts from "../../hooks/useGetAllPosts";
import { setPosts, setUserPost } from "../../Redux/postSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useGetAllPosts();

  const { authUser } = useSelector((store) => store.auth);

  // ===== Navigation Handler ===== //
  const handleClick = async (text) => {
    if (text === "Log Out") {
      try {
        const res = await axios.get("/api/user/logout");
        toast.success(res.data.message);
        dispatch(setAuthUser(null));
        dispatch(setSuggestedUsers([]));
        dispatch(setPosts([]));
        dispatch(setUserProfile(null));
        dispatch(setUserPost([]));
        navigate("/login");
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Logout failed");
      }
    } else if (text === "Home") navigate("/home/screen");
    else if (text === "Profile") navigate("/home/profile");
    else if (text === "Messages") navigate("/home/message");
    else if (text === "Create") navigate("/home/create");
    else if (text === "Orion AI") navigate("/home/explore");
    else if (text === "Notifications") navigate("/home/notification");
    else if (text === "Search") navigate("/home/search");
  };

  const sideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <AtomIcon />, text: "Orion AI" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <Heart />, text: "Notifications" },
    {
      icon: (
        <Avatar>
          <img
            src={authUser?.profilePic}
            alt={authUser?.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Log Out" },
  ];

  return (
    <div
      className="w-[20%] h-screen flex flex-col items-start p-6 font-[Orbitron] text-gray-300 border-r border-[#3b006b]"
      style={{
        background:
          "linear-gradient(to right, #0a0015, #180030, #2e005e, #40007a)",
        boxShadow: "inset -6px 0 15px rgba(187, 0, 255, 0.4)", // neon violet glow
      }}
    >
      {/* Logo */}
      <span className="text-4xl font-bold mb-10 text-[#a020f0] drop-shadow-[0_0_15px_#bb00ff] cursor-wait" onClick={() => navigate('/home')}>
        <span className="text-5xl text-[#7d00ff] drop-shadow-[0_0_20px_#7d00ff]">
          O
        </span>
        rion
      </span>

      {/* Sidebar Items */}
      <div className="flex flex-col gap-6 w-full">
        {sideBarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(item.text)}
            className="flex items-center gap-4 text-lg px-4 py-2 rounded-xl transition-all duration-200 hover:bg-[#7d00ff15] hover:shadow-[0_0_15px_#a020f0] hover:text-[#c06eff] w-full text-left cursor-wait"
          >
            <span className="text-xl text-[#c06eff] group-hover:text-[#d080ff] transition-all duration-300">
              {item.icon}
            </span>
            <span>{item.text}</span>
          </button>
        ))}
      </div>

      {/* Bottom Glow Line */}
      <div className="mt-auto w-full flex justify-center">
        <p className="text-sm text-[#bb00ff] drop-shadow-[0_0_10px_#bb00ff] mt-6 tracking-wide">
          <span className="text-[#d580ff]">Mini Orion™</span>
        </p>
      </div>
    </div>
  );
};

export default LeftSidebar;
