import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useGetPostByUser from "../../hooks/useGetPostByUser";
import axios from "../../utils/axios";
import toast from "react-hot-toast";
import { setAuthUser } from "../../Redux/authSlice";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditForm, setShowEditForm] = useState(false);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setuserName] = useState("");

  const { authUser } = useSelector((store) => store.auth);
  const { userPost } = useSelector((store) => store.post);
  const postId = authUser?._id;
  const dispatch = useDispatch();

  useGetPostByUser(postId);

  const posts = userPost || [];
  const savedPosts = authUser?.bookmarks || [];

  // Handle form submit
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("bio", bio);
      if (profilePic) formData.append("profilePic", profilePic);
      if (userName) formData.append("userName", userName);

      const res = await axios.put("/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      dispatch(setAuthUser(res.data.user));
      setShowEditForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const openEditForm = () => {
    setBio(authUser?.bio || "");
    setShowEditForm(true);
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
          src={authUser?.profilePic}
          alt="profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "100%",
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
              @{authUser?.userName}
            </h2>
            <button
              style={{
                background: "transparent",
                border: "1px solid #00eaff",
                color: "#00eaff",
                padding: "5px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={openEditForm}
              onMouseEnter={(e) => (e.target.style.background = "#00eaff33")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              Edit Profile
            </button>
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
              <strong>{authUser?.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{authUser?.following?.length || 0}</strong> following
            </span>
          </div>

          <p style={{ color: "#8be9fd", maxWidth: "300px" }}>{authUser?.bio}</p>
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

      {/* Posts */}
      {activeTab === "posts" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {posts.length === 0 ? (
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
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "wait",
                  boxShadow: "0 0 15px #00eaff55",
                  height: "300px",
                  backgroundColor: "#0f0c29",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    objectFit: "center",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
                <div
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
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  ❤️ {post.likes?.length || 0} &nbsp;&nbsp; 💬{" "}
                  {post.comments?.length || 0}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Saved Posts */}
      {activeTab === "saved" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          {savedPosts.length === 0 ? (
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
          ) : (
            savedPosts.map((post) => (
              <div
                key={post._id}
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "wait",
                  boxShadow: "0 0 15px #00eaff55",
                  height: "300px",
                  backgroundColor: "#0f0c29",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                    objectFit: "center",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
                <div
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
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  ❤️ {post.likes?.length || 0} &nbsp;&nbsp; 💬{" "}
                  {post.comments?.length || 0}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tagged Placeholder */}
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

      {/* Edit Form */}
      {showEditForm && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
            backdropFilter: "blur(4px)",
          }}
        >
          <form
            onSubmit={onSubmitHandler}
            style={{
              background: "#0f0c29",
              padding: "30px",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              boxShadow: "0 0 20px #00eaff55",
            }}
          >
            <h2 style={{ color: "#00eaff", textAlign: "center" }}>Edit Profile</h2>

            <label style={{ color: "#8be9fd", fontSize: "0.9rem" }}>
              Current Name: {authUser?.userName}
              <input
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                rows={1}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #00eaff33",
                  background: "rgba(0,0,0,0.3)",
                  color: "#00eaff",
                  outline: "none",
                  resize: "none",
                }}
              />
            </label>

            <label style={{ color: "#8be9fd", fontSize: "0.9rem" }}>
              Bio:
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #00eaff33",
                  background: "rgba(0,0,0,0.3)",
                  color: "#00eaff",
                  outline: "none",
                  resize: "none",
                }}
              />
            </label>

            <label style={{ color: "#8be9fd", fontSize: "0.9rem" }}>
              Profile Picture:
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  marginTop: "5px",
                  cursor: "pointer",
                  color: "#00eaff",
                }}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "linear-gradient(135deg,#00eaff,#b84aff)",
                  color: "#0d0d0d",
                  fontWeight: "600",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #00eaff33",
                  background: "transparent",
                  color: "#00eaff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
