import React, { useState } from "react";
import "./RegisterPage.css";
import urlConfig from '../../config.js';
import { useAppContext } from '../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';



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
  const handleRegister = () => {
    try{
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
            localStorage.setItem('token', data.authtoken);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('email', email);
            setIsLoggedIn(true);
            navigate('/app')
          } else {
            setShowerr(data.message || 'Registration failed');
          }
    } catch (e) {
            console.log("Error fetching details: " + e.message);
        }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>
            <div className="text-danger">{showerr}</div>
            <form>
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
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
                <label htmlFor="lastName">Last Name:</label>
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
                <label htmlFor="email">Email:</label>
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
                <label htmlFor="password">Password:</label>
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
                type="submit"
                className="btn btn-primary btn-block"
                onClick={handleRegister}
              >
                Register
              </button>
            </form>
            <p className="mt-4 text-center">
              Already a member?{" "}
              <a href="/app/login" className="text-primary">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  ); //end of return
}
export default RegisterPage;
