import React, { createContext, useState, useEffect } from "react";

// Create UserContext with default values
const UserContext = createContext({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  cartLength: 0,
  setCartLength: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, cartLength, setCartLength }}>
      {children}
    </UserContext.Provider>
  );
};


export default UserContext;
