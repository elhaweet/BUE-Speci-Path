import React, { useState } from "react";
// import "./Auth.css";

const Auth = () => {
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      formType === "login"
        ? "http://localhost:5000/login"
        : "http://localhost:5000/signup";

    const requestData =
      formType === "login"
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, password: formData.password, name: formData.name };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Success!");
        if (formType === "login") {
          localStorage.setItem("token", data.jwt);
        }
      } else {
        setMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{formType === "login" ? "Login" : "Sign Up"}</h1>
        <form onSubmit={handleSubmit}>
          {formType === "signup" && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="auth-button">
            {formType === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="toggle-text">
          {formType === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            className="toggle-link"
            onClick={() => {
              setFormType(formType === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {formType === "login" ? "Sign Up" : "Login"}
          </span>
        </p>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Auth;
