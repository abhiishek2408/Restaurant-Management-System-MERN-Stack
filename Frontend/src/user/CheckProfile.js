import React, { useEffect, useState } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState(null);  // to store user data
    const [error, setError] = useState(null);  // to store any error messages

    // Fetch user data from the PHP onlinerestro/backend when the component mounts
    useEffect(() => {
        // Fetch session data
        const fetchSessionData = async () => {
            try {
                const response = await fetch('http://localhost/onlinerestro/backend/profilecheck.php', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'same-origin',  // This sends cookies with the request (important for sessions)
                });

                const data = await response.json();

                if (data.status === 'success') {
                    setUser(data.user);  // Save user data to state
                } else {
                    setError(data.message || 'Failed to fetch user data');
                }
            } catch (error) {
                setError('An error occurred while fetching user data');
            }
        };

        fetchSessionData();  // Call the function to fetch user data
    }, []);  // Empty dependency array ensures this runs once when the component mounts

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Bio:</strong> {user.bio}</p>
            {user.profile_img && (
                <img
                    src={`data:image/jpeg;base64,${user.profile_img}`}
                    alt="Profile"
                    width="150"
                    height="150"
                />
            )}
        </div>
    );
};

export default UserProfile;
