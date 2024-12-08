import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "",
    name: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and redirect to "/recommend" if not present
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    // Fetch user data if the token exists
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          username: response.data.username,
          name: response.data.name,
          password: "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Error fetching user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEdit = () => {
    setEditMode(true); // Enable editing mode
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    const updatedUser = {
      name: user.name,
      password: user.password || undefined,
    };

    try {
      // Save the updated user data to the server
      const response = await axios.put("http://localhost:5000/user", updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(response.data.message || "User updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Error updating user data.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); // Update user state on input change
  };

  const getMessageClass = () =>
    message.toLowerCase().includes("error") ? "message error" : "message success";

  const handleButtonClick = (event) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];

    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="animated-background">
        <div className="animated-shape shape1"></div>
        <div className="animated-shape shape2"></div>
        <div className="animated-shape shape3"></div>
        <div className="animated-shape shape4"></div>
      </div>
      <div className="user-profile">
        <h2>User Profile</h2>
        {message && <div className={getMessageClass()}>{message}</div>}
        <div className="user-details">
          <div className="user-info">
            <label>Username</label>
            <input type="text" name="username" value={user.username} disabled />
          </div>
          <div className="user-info">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
          <div className="user-info">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
          {!editMode ? (
            <button className="edit-button" onClick={(e) => { handleButtonClick(e); handleEdit(); }}>
              Edit
            </button>
          ) : (
            <div className="edit-actions">
              <button className="save-button" onClick={(e) => { handleButtonClick(e); handleSave(); }}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={(e) => { handleButtonClick(e); setEditMode(false); }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;

