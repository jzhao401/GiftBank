import React, { useState } from "react";
import "./RegistrationPage.css";
import { urlConfig } from '../../config.js';
import { useAppContext } from '../../context/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';



function RegisterPage() {
  //insert code here to create useState hook variables for firstName, lastName, email, password
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showerr, setShowerr] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  // insert code here to create handleRegister function and include console.log
  const handleRegister = async () => {
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password
        })
      })
      const data = await response.json();
      if (data.authtoken) {
        sessionStorage.setItem('token', data.authtoken);
        sessionStorage.setItem('name', `${firstName} ${lastName}`);
        sessionStorage.setItem('email', email);
        setIsLoggedIn(true);
        alert("Registration successful! Redirecting to home page...");
        navigate('/');
      } else {
        if (data.error === "User already exists") {
          setShowerr("Account already exists");
        } else {
          setShowerr(data.error || data.message || 'Registration failed');
        }
      }
    } catch (e) {
      console.log("Error fetching details: " + e.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>
            <div className="text-danger">{showerr}</div>
            <form>
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your firstName"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your firstName"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="account@example.com"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="use combination of letters and numbers"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleRegister}
              >
                Register
              </button>
            </form>
            <p className="mt-4 text-center">
              Already a member?{" "}
              Already a member?{" "}
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  ); //end of return
}
export default RegisterPage;
