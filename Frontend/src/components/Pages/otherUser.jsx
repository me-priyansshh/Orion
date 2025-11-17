import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import useGetPostByUser from "../../hooks/useGetPostByUser";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { setUserProfile, setAuthUser } from "../../Redux/authSlice";

const OtherUser = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const { userPost } = useSelector((store) => store.post);
  const { userProfile, authUser } = useSelector((store) => store.auth);

  useGetUserProfile(id);
  useGetPostByUser(id);

  const posts = userPost || [];
  const savedPosts = userProfile?.bookmarks || [];
  const isFollowed = authUser?.following?.includes(id);

  const handleFollowOrUnfollow = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.put(`/api/user/follow/${id}`);
      toast.success(response.data.message);

      // ✅ Update viewed user's followers
      let updatedUserProfile = { ...userProfile };
      if (isFollowed) {
        updatedUserProfile.followers = userProfile.followers.filter(
          (uid) => uid !== authUser._id
        );
      } else {
        updatedUserProfile.followers = [
          ...userProfile.followers,
          authUser._id,
        ];
      }
      dispatch(setUserProfile(updatedUserProfile));

      // ✅ Update logged-in user's following
      let updatedAuthUser = { ...authUser };
      if (isFollowed) {
        updatedAuthUser.following = authUser.following.filter(
          (uid) => uid !== id
        );
      } else {
        updatedAuthUser.following = [...authUser.following, id];
      }
      dispatch(setAuthUser(updatedAuthUser));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        color: "#00eaff",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      {/* Profile Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "50px",
          marginBottom: "40px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <img
          src={
            userProfile?.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            border: "3px solid #00eaff",
            boxShadow: "0 0 20px #00eaff",
            objectFit: "cover",
            backgroundColor: "#000",
          }}
        />

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", fontWeight: "600" }}>
              @{userProfile?.userName}
            </h2>

            {/* Hide Follow button on your own profile */}
            {authUser?._id !== id && (
              <button
                disabled={isLoading}
                onClick={() => handleFollowOrUnfollow(id)}
                style={{
                  background: isFollowed ? "#00eaff33" : "transparent",
                  border: "1px solid #00eaff",
                  color: "#00eaff",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "0.3s",
                  fontWeight: "600",
                }}
              >
                {isLoading
                  ? "..."
                  : isFollowed
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "25px",
              fontSize: "1rem",
              marginBottom: "15px",
            }}
          >
            <span>
              <strong>{posts.length}</strong> posts
            </span>
            <span>
              <strong>{userProfile?.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{userProfile?.following?.length || 0}</strong> following
            </span>
          </div>

          <p style={{ color: "#8be9fd", maxWidth: "300px" }}>
            {userProfile?.bio}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "60px",
          borderTop: "1px solid #00eaff44",
          borderBottom: "1px solid #00eaff44",
          width: "100%",
          maxWidth: "700px",
          padding: "10px 0",
          marginBottom: "40px",
        }}
      >
        {["posts", "saved", "tagged"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              cursor: "pointer",
              fontWeight: activeTab === tab ? "700" : "400",
              color: activeTab === tab ? "#00eaff" : "#8be9fd",
              textShadow:
                activeTab === tab
                  ? "0 0 10px #00eaff, 0 0 20px #00eaff"
                  : "none",
              transition: "0.3s",
            }}
          >
            {tab.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Posts Grid */}
      {(activeTab === "posts" || activeTab === "saved") && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {activeTab === "posts"
            ? posts.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#8be9fd",
                    fontSize: "1.2rem",
                    gridColumn: "1/-1",
                  }}
                >
                  No Posts Yet
                </div>
              )
            : savedPosts.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "#8be9fd",
                    fontSize: "1.2rem",
                    gridColumn: "1/-1",
                  }}
                >
                  No Saved Posts Yet
                </div>
              )}

          {(activeTab === "posts" ? posts : savedPosts).map((post) => (
            <div
              key={post._id}
              style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 0 15px #00eaff55",
                height: "300px",
                backgroundColor: "#0f0c29",
              }}
            >
              <img
                src={post.image}
                alt={post.caption}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "0.3s",
                }}
              />
              <div
                className="hoverOverlay"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.6)",
                  color: "#00eaff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: "0",
                  transition: "opacity 0.3s",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  textShadow: "0 0 10px #00eaff",
                  cursor: "crosshair",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                ❤️ {post.likes?.length || 0} &nbsp;&nbsp; 💬{" "}
                {post.comments?.length || 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tagged */}
      {activeTab === "tagged" && (
        <div
          style={{
            textAlign: "center",
            color: "#8be9fd",
            marginTop: "50px",
            fontSize: "1.3rem",
          }}
        >
          No Tagged Posts Yet
        </div>
      )}
    </div>
  );
};

export default OtherUser;
