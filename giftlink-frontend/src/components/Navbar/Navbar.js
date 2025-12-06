import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    setIsLoggedIn(false);
    navigate("/");
    // window.location.reload(); // Optional, but helps clear any other state
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        GiftLink
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNavbar}
        aria-controls="navbarNav"
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/search" onClick={() => setIsOpen(false)}>
              Search
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile" onClick={() => setIsOpen(false)}>
              Profile
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          {isLoggedIn ? (
            <li className="nav-item">
              <span
                className="nav-link logout-btn"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </span>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link login-btn" to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link register-btn" to="/register" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
