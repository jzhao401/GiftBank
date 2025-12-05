import React, { useState, useEffect } from "react";
import "./LoginPage.css";
//{{Insert code here}} //Task 1: Import urlConfig from `giftlink-frontend/src/config.js`
import { urlConfig } from '../../config.js';
import { useAppContext } from '../../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
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
  const bearerToken = sessionStorage.getItem('bearer-token');

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      navigate('/app')
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
          'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
        },
        body: JSON.stringify({ email: email, password: password }),
        //{{Insert code here}} //Task 7: Set method
        //{{Insert code here}} //Task 8: Set headers
        //{{Insert code here}} //Task 9: Set body to send user details
      });
      const data = await response.json();
      if (data.authtoken) {
        sessionStorage.setItem('token', data.authtoken);
        sessionStorage.setItem('name', data.userName);
        sessionStorage.setItem('email', data.userEmail);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        setIncorrect("Wrong password. Try again.");
        //Below is optional, but recommended - Clear out error message after 2 seconds
        setTimeout(() => {
          setIncorrect("");
        }, 2000);
      }
      //{code from Step 1}
      // Task 1: Access data coming from fetch API
      // Task 2: Set user details
      // Task 3: Set the user's state to log in using the `useAppContext`.
      // Task 4: Navigate to the MainPage after logging in.
      // Task 5: Clear input and set an error message if the password is incorrect
      // Task 6: Display an error message to the user.
    } catch (e) {
      setIncorrectPassword("Error fetching details: " + e.message);
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
            <span style={{ color: 'red', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px' }}>{incorrect}</span>
            {/* insert code here to create a button that performs the `handleLogin` function on click */}
            <button className="btn btn-primary btn-block" onClick={handleLogin}>
              Login
            </button>
            <p className="mt-4 text-center">
              New here?{" "}
              <a href="/app/register" className="text-primary">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
