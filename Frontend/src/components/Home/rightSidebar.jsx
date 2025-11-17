import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import useSuggestedUsers from "../../hooks/useSuggestedUsers";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ import navigate

const RightSidebar = () => {
  useSuggestedUsers();
  const { suggestedUsers, authUser } = useSelector((store) => store.auth);
  const navigate = useNavigate(); // ✅ initialize navigate

  // ✅ handle user click
  const handleUserClick = (userId) => {
    navigate(`/home/otherUser/${userId}`); // ✅ navigate dynamically with ID
  };

  

  return (
    <div
      className="w-[20%] h-full flex flex-col justify-between border-l border-[#3b006b] text-white"
      style={{
        background: "linear-gradient(to right, #1a001f, #2a0040, #3a006b)",
        boxShadow: "inset 6px 0 12px -2px rgba(187, 0, 255, 0.5)",
      }}
    >
      <div className="p-4 overflow-y-auto">
        {/* Logged-in User */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar.Root className="inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-[#bb00ff] shadow-[0_0_10px_#bb00ff80] bg-[#150015]">
            <Avatar.Image
              className="w-full h-full rounded-full object-cover cursor-pointer"
              src={
                authUser?.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt={authUser?.userName}
              onClick={() => navigate("/home/profile")}
            />
            <Avatar.Fallback
              className="text-[#bb00ff] text-xs font-semibold"
              delayMs={600}
            >
              {authUser?.userName?.substring(0, 2).toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>

          <div>
            <h3 className="text-[#d580ff] font-semibold">
              {authUser?.userName || "@orion_user"}
            </h3>
            {authUser?.bio && (
              <p className="text-sm text-gray-400 italic">{authUser.bio}</p>
            )}
          </div>
        </div>

        <hr className="border-[#3b006b] mb-4" />

        {/* Suggested Users */}
        <h2 className="text-xl font-bold text-[#d580ff] mb-4">
          Suggested Users
        </h2>

        <div className="flex flex-col gap-4 text-gray-300 overflow-y-auto">
          {suggestedUsers && suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)} // ✅ sends userId
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2a004050] transition-all cursor-wait"
              >
                <Avatar.Root className="inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-[#bb00ff] shadow-[0_0_10px_#bb00ff80] bg-[#150015] ">
                  <Avatar.Image
                    className="w-full h-full rounded-full object-cover"
                    src={
                      user.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt={user.userName}
                  />
                  <Avatar.Fallback
                    className="text-[#bb00ff] text-xs font-semibold"
                    delayMs={600}
                  >
                    {user.userName?.substring(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>

                <div className="flex flex-col">
                  <span className="text-lg text-[#e6ccff] font-semibold">
                    {user.userName}
                  </span>
                  {user.bio && (
                    <span className="text-xs text-[#bfa6ffcc] italic">
                      {user.bio}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No suggestions available</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-sm">
        <p className="text-[#bb00ff] font-semibold">© Mini Orion™ 2025</p>
        <p className="text-[#d580ff] text-xs mt-1">
          priyanshkumar212@gmail.com
        </p>
      </div>
    </div>
  );
};

export default RightSidebar;
