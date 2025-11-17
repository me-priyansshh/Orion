import React, { useState } from "react";
import { useSelector } from "react-redux";
import PostCard from "./Screenfunctions";

const Screen = () => {
  
  const { postt } = useSelector((store) => store.post);
  const { authUser } = useSelector((store) => store.auth);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [openComment, setOpenComment] = useState(null);

  const toggleDropdown = (postId) =>
    setOpenDropdown(openDropdown === postId ? null : postId);

  const toggleComment = (postId) =>
    setOpenComment(openComment === postId ? null : postId);

  return (
    <div className="w-full min-h-screen bg-[#0d0d0d] text-gray-200 px-8 py-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* ====== STORIES / STATUS ====== */}
        <div className="flex space-x-4 overflow-x-auto pb-4 border-b border-gray-800">
          {postt.length === 0 && (
            <p className="text-gray-400 text-sm">No stories yet</p>
          )}
          {postt.map((post) => (
            <div key={post._id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-[#b200ff] p-0.5">
                <img
                  src={post.author.profilePic}
                  alt={post.author.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <p className="text-xs mt-2 text-gray-300">{post.author.userName}</p>
            </div>
          ))}
        </div>

        {/* ====== POSTS SECTION ====== */}
        <div className="space-y-10">
          {postt.length === 0 && (
            <p className="text-center text-gray-400">No posts yet</p>
          )}

          {postt.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              authUser={authUser}
              openDropdown={openDropdown}
              toggleDropdown={toggleDropdown}
              openComment={openComment}
              toggleComment={toggleComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Screen;
