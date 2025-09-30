import React, { useContext } from "react";
import UserContext from "../context/UseContext"; 
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(UserContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder for logout functionality
    navigate('/login');
  };

  if (!user) {
    return <p style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>No user data found. Please log in.</p>;
  }

  return (
    <div style={styles.profile}>
    <div style={styles.container}>
      <h2 style={styles.header}>User Profile</h2>
      
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <img
            src={user.profile_img || "https://cdn.vectorstock.com/i/500p/96/75/gray-scale-male-character-profile-picture-vector-51589675.jpg"}
            alt="Profile"
            style={styles.profileImage}
          />
          <h3 style={styles.username}>{user.username || "Username"}</h3>
          <p style={styles.bio}>{user.bio || "I am a Software developer"}</p>
        </div>

        <div style={styles.infoSection}>
          <p style={styles.infoRow}>
            <span style={styles.label}>Email:</span> {user.email || "example@example.com"}
          </p>
          <p style={styles.infoRow}>
            <span style={styles.label}>Phone:</span> {user.phone || "Not provided"}
          </p>
          <p style={styles.infoRow}>
            <span style={styles.label}>Address:</span> {user.address || "Not provided"}
          </p>
        </div>

        <div style={styles.buttonContainer}>
          <button style={styles.editButton}>Edit Profile</button>
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
          <button style={styles.backButton} onClick={() => navigate('/')}>Back to home page!</button>
        </div>
      </div>
    </div>
    </div>
  );
};

// Inline styles
const styles = {
 
  profile: {
    maxWidth: "1400px",
    margin: "20px auto",
    padding: "10px",
    fontFamily: "'Roboto', sans-serif", // Apply Roboto font globally
    backgroundColor: "#2c2c2c", // Background color for the entire page
    color: "white",
  },
  
 

  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "10px",
    borderradius:"12px",
    fontFamily: "'Roboto', sans-serif", // Apply Roboto font globally
    backgroundColor: "#2c2c2c", // Background color for the entire page
    color: "white",
  },
  header: {
    backgroundColor: "#ff7518", // Theme color
    color: "#fff",
    padding: "10px 20px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "8px",
    textAlign: "center",
    
  },
  profileCard: {
    backgroundColor: "#2c2c2c",
    color:"white",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    animation: "slideUp 0.8s ease-out", // Animation for profile card
  },
  profileHeader: {
    textAlign: "center",
    paddingBottom: "20px",
    borderBottom: "1px solid #ddd",
  },
  profileImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #ff7518", // Theme color border
    marginBottom: "10px",
  },
  username: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
  bio: {
    fontSize: "14px",
    fontStyle: "italic",
    color: "white",
  },
  infoSection: {
    marginTop: "20px",
    lineHeight: "1.6", // Ensures no extra gaps between rows
    color: "white",
  },
  infoRow: {
    fontSize: "16px",
    margin: "0", // Remove extra margin
    padding: "5px 0", // Adjust padding to control spacing
    color: "white",
  },
  label: {
    fontWeight: "bold",
    marginRight: "8px",
    color: "white",
  },
  buttonContainer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-start", // Align buttons to the left
    gap: "10px", // Space between buttons
  },
  editButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "#ff7518", // Theme color
    border: "2px solid #ff7518", // Theme color border
    cursor: "pointer",
    transition: "transform 0.3s ease", // Add transition effect
  },
  logoutButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#ff7518", // Theme color
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.3s ease", // Add transition effect
  },
  backButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "#333",
    border: "2px solid #ddd",
    cursor: "pointer",
    transition: "transform 0.3s ease", // Add transition effect
  },
  // Add keyframes for animations
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  '@keyframes slideUp': {
    '0%': {
      transform: 'translateY(20px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
};


export default Profile;
