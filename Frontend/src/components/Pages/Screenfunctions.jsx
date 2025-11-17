import React, { use, useState } from "react";
import { Avatar } from "@radix-ui/react-avatar";
import { MoreHorizontal, Heart, MessageCircle, Send } from "lucide-react";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setComments } from "../../Redux/commentSlice";
import { setPosts } from "../../Redux/postSlice";
import useGetPostByUser from "../../hooks/useGetPostByUser";
import { setAuthUser } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";

const PostCard = ({
  post,
  authUser,
  openDropdown,
  toggleDropdown,
  openComment,
  toggleComment,
}) => {
  const { _id, author, caption, image, likes, comments } = post;
  const dispatch = useDispatch();
  const commentState = useSelector((store) => store.comment);
  const [commentInput, setCommentInput] = useState("");
  const [liked, setliked] = useState(likes.includes(authUser?._id) || false);
  const [likeCount, setLikeCount] = useState(likes.length);

  const { postt } = useSelector((store) => store.post);

  const handleCommentSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`/api/post/addComment/${_id}`, {
        text: commentInput,
      });
      toast.success(res.data.message);
      setCommentInput("");
      dispatch(setComments([...commentState.comments, res.data.comment]));
      const updatedPosts = postt.map((p) =>
        p._id === _id
          ? {
              ...p,
              comments: [...p.comments, res.data.comment],
            }
          : p
      );
      dispatch(setPosts(updatedPosts));
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const postId = authUser?._id;
  const navigate = useNavigate();

  useGetPostByUser(postId);

  const { userPost } = useSelector((store) => store.post);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/api/post/deletePost/${_id}`);
      toast.success(res.data.message);
      window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error(error.res?.data?.message || "Delete failed");
    }
  };

  const handleLikeOrDislike = async (_id) => {
    try {
      const action = liked ? "unlike" : "like";
      const res = await axios.put(`/api/post/${action}/${_id}`);

      const updatedPosts = postt.map((p) =>
        p._id === _id
          ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== authUser._id)
                : [...p.likes, authUser._id],
            }
          : p
      );

      dispatch(setPosts(updatedPosts));
      setliked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      dispatch(setPosts(updatedPosts));
    } catch (error) {
      console.log(error);
      toast.error(error.res?.data?.message);
    }
  };

  const handleSave = async (_id) => {
    try {
      const res = await axios.put(`/api/post/bookmarkPost/${_id}`);
      toast.success(res.data.message);
      dispatch(setAuthUser(res.data.user));
    } catch (error) {
      console.log(error);
      toast.error(error.res?.data?.message);
    }
  };

  return (
    <div className="bg-[#111] rounded-2xl shadow-[0_0_10px_#00fff220] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3 cursor-grab" onClick={() => navigate(`/home/otherUser/${post.author._id}`)}>
          <Avatar>
            <img
              src={author.profilePic}
              alt={author.userName}
              className="w-12 h-12 rounded-full object-cover "
            />
          </Avatar>
          <span className="font-semibold text-[#00fff7] text-lg">
            @{author.userName}
          </span>
        </div>
        <div className="relative">
          <div
            className="text-gray-400 hover:text-[#00fff7] cursor-pointer"
            onClick={() => toggleDropdown(_id)}
          >
            <MoreHorizontal />
          </div>
          {openDropdown === _id && (
            <div className="absolute right-0 mt-2 w-28 bg-[#222] border border-gray-700 rounded-lg shadow-lg z-10">
              <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#00fff720] hover:text-[#00fff7] rounded-t-lg">
                Follow
              </button>
              {authUser?._id === author._id && (
                <button
                  className="w-full px-4 py-2 text-left text-gray-300 hover:bg-[#ff004c20] hover:text-[#ff004c] rounded-b-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      <img
        src={image}
        alt="Post"
        className="w-full max-h-[500px] object-contain rounded-xl"
      />

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 px-4 text-gray-400">
        <div className="flex items-center gap-6">
          <Heart
            className="hover:text-[#ff004c] hover:scale-110 cursor-pointer transition"
            fill={liked ? "#ff004c" : "none"}
            stroke={liked ? "none" : "#ff004c"}
            strokeWidth={2}
            onClick={() => handleLikeOrDislike(_id)}
          />
          <MessageCircle
            className="hover:text-[#00fff7] cursor-pointer"
            onClick={() => toggleComment(_id)}
          />
          <Send className="hover:text-[#00fff7] cursor-pointer" />
        </div>

        <div
          className="cursor-pointer hover:text-[#00fff7]"
          onClick={() => handleSave(_id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5v14l7-7 7 7V5a2 2 0 00-2-2H7a2 2 0 00-2 2z"
            />
          </svg>
        </div>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 py-2">
        <p className="text-sm font-semibold text-gray-300">
          {likeCount} {likeCount === 1 ? "like" : "likes"} • {comments.length}{" "}
          {comments.length === 1 ? "comment" : "comments"}
        </p>
        <p className="text-sm mt-1">
          <span className="font-semibold mr-2 text-[#00fff7]">
            {author.userName}
          </span>
          {caption}
        </p>
      </div>

      {/* Comments Panel */}
      {openComment === _id && (
        <div className="px-4 py-3 border-t border-gray-800 space-y-2">
          {comments.length === 0 && (
            <p className="text-gray-400 text-sm">No comments yet</p>
          )}
          {comments.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-[#222] p-2 rounded-xl"
            >
              <div className="w-9 h-9 rounded-full border-2 border-[#00fff7] flex items-center justify-center overflow-hidden bg-[#111]">
                <img
                  src={
                    c?.author?.profilePic ||
                    `https://i.pravatar.cc/150?img=${i + 10}`
                  }
                  alt={c?.author?.userName || c.user}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <p className="text-sm">
                <span className="font-semibold text-[#00fff7]">
                  {c?.author?.userName || c.user}
                </span>{" "}
                {c.text}
              </p>
            </div>
          ))}

          {/* Add Comment */}
          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center gap-2 mt-2"
          >
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 p-2 rounded-xl bg-[#222] text-gray-200 placeholder-gray-500 outline-none"
            />
            <button
              type="submit"
              className="bg-[#00fff7] text-[#0d0d0d] px-4 py-2 rounded-xl font-semibold hover:bg-[#00e0ff] transition"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
