import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({});
  const { setUserName } = useAppContext();
  const [changed, setChanged] = useState("");

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authtoken = sessionStorage.getItem("token");
    if (!authtoken) {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("token");
      const email = sessionStorage.getItem("email");
      
      if (!authtoken || !email) {
        navigate("/login");
        return;
      }

      // Fetch profile from backend
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authtoken}`,
          'Email': email,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userProfile = {
          name: data.name,
          email: data.email,
        };
        
        setUserDetails(userProfile);
        setUpdatedDetails(userProfile);
        
        // Update sessionStorage with fresh data from database
        sessionStorage.setItem("name", data.name);
      } else {
        // Token might be expired or invalid
        console.error("Failed to fetch profile, status:", response.status);
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      sessionStorage.clear();
      navigate("/login");
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const authtoken = sessionStorage.getItem("token");
      const email = sessionStorage.getItem("email");

      if (!authtoken || !email) {
        navigate("/login");
        return;
      }

      // Split name into firstName and lastName for backend
      const nameParts = updatedDetails.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
        firstName,
        lastName,
      };
      
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
          "Email": email,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Update context and session storage
        setUserName(updatedDetails.name);
        sessionStorage.setItem("name", updatedDetails.name);
        setUserDetails(updatedDetails);
        setEditMode(false);
        
        // Display success message
        setChanged("Name Changed Successfully!");
        setTimeout(() => {
          setChanged("");
          navigate("/");
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled // Disable the email field
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Hi, {userDetails.name}</h1>
          <p>
            {" "}
            <b>Email:</b> {userDetails.email}
          </p>
          <button onClick={handleEdit}>Edit</button>
          <span
            style={{
              color: "green",
              height: ".5cm",
              display: "block",
              fontStyle: "italic",
              fontSize: "12px",
            }}
          >
            {changed}
          </span>
        </div>
      )}
    </div>
  );
};

export default Profile;
