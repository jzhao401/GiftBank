import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { urlConfig } from '../../config.js';
import { useAppContext } from '../../context/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';
//{{Insert code here}} //Task 2: Import useAppContext `giftlink-frontend/context/AuthContext.js`
//{{Insert code here}} //Task 3: Import useNavigate from `react-router-dom` to handle navigation after successful registration.

//Do these tasks inside the RegisterPage function after the useStates definition
//{{Insert code here}} //Task 4: Include a state for incorrect password.
//{{Insert code here}} //Task 5: Create a local variable for `navigate`,`bearerToken`   and `setIsLoggedIn`.
//{{Insert code here}} //Task 6. If the bearerToken has a value (user already logged in), navigate to MainPage

function LoginPage() {
  //insert code here to create useState hook variables for email, password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState("");
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate])

  // insert code here to create handleLogin function and include console.log
  const handleLogin = async () => {
    try {
      //first task
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (data.authtoken) {
        sessionStorage.setItem('token', data.authtoken);
        sessionStorage.setItem('name', data.userName);
        sessionStorage.setItem('email', data.userEmail);
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setEmail("");
        setPassword("");
        setIncorrect("Wrong password. Try again.");
        //Below is optional, but recommended - Clear out error message after 2 seconds
        setTimeout(() => {
          setIncorrect("");
        }, 2000);
      }
    } catch (e) {
      setIncorrect("Error fetching details: " + e.message);
    }

  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

            {/* insert code here to create input elements for the variables email and  password */}
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="text-danger small font-italic d-block mb-2" style={{ height: '.5cm' }}>{incorrect}</span>
            {/* insert code here to create a button that performs the `handleLogin` function on click */}
            <button className="btn btn-primary btn-block" onClick={handleLogin}>
              Login
            </button>
            <p className="mt-4 text-center">
              New here?{" "}
              New here?{" "}
              <Link to="/register" className="text-primary">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
