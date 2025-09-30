import React, { useContext } from "react";
import UserContext from "../context/UseContext"; 
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(UserContext); // Access user data from context
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder for logout functionality
    navigate('/login');
  };



  return (
    <div style={styles.containerbox}>
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
  );
};

// Inline styles
const styles = {
  containerbox: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "10px",
  },
  header: {
    backgroundColor: "#f7941d",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "8px",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginTop: "10px",
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
    border: "3px solid #f7941d",
    marginBottom: "10px",
  },
  username: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  bio: {
    fontSize: "14px",
    color: "#666",
    fontStyle: "italic",
  },
  infoSection: {
    marginTop: "20px",
    lineHeight: "1.6", // Ensures no extra gaps between rows
  },
  infoRow: {
    fontSize: "16px",
    color: "#333",
    margin: "0", // Remove extra margin
    padding: "5px 0", // Adjust padding to control spacing
  },
  label: {
    fontWeight: "bold",
    color: "#666",
    marginRight: "8px",
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
    color: "#f7941d",
    border: "2px solid #f7941d",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#f7941d",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  backButton: {
    padding: "8px 16px",
    borderRadius: "4px",
    backgroundColor: "#fff",
    color: "#333",
    border: "2px solid #ddd",
    cursor: "pointer",
  },
};

export default Profile;
