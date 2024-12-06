import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./main.jsx";
import './Navbar.css';

const Navbar = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleAuthClick = () => {
    if (authState.isLoggedIn) {
      // Log the user out by clearing JWT from localStorage and updating the auth state
      localStorage.removeItem("token");
      setAuthState({ isLoggedIn: false });
      navigate("/");
    } else {
      navigate("/");
    }
  };

  // Hide the Navbar if we're on the login page
  if (location.pathname === "/") {
    return null;
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="navbar-toggle-button" onClick={toggleSidebar}>
        <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
      <div className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="navbar-links">
          <Link to="/recommend" 
            className={`navbar-link ${location.pathname === '/recommend' ? 'active' : ''}`}>
            Recommend
          </Link>
          <Link to="/career" 
            className={`navbar-link ${location.pathname === '/career' ? 'active' : ''}`}>
            Career
          </Link>
          <Link to="/knowledgeHub" 
            className={`navbar-link ${location.pathname === '/knowledgeHub' ? 'active' : ''}`}>
            Knowledge Hub
          </Link>
          
          {authState.isLoggedIn && (
            <Link to="/review" 
              className={`navbar-link ${location.pathname === '/review' ? 'active' : ''}`}>
              Review
            </Link>
          )}

          {authState.isLoggedIn && (
            <Link to="/profile" 
              className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
              User Profile
            </Link>
          )}
        </div>

        <button 
          onClick={handleAuthClick}
          className={`navbar-button ${authState.isLoggedIn ? 'logout' : 'login'}`}
        >
          {authState.isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </>
  );
};

export default Navbar;
