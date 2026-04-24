import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedIsGuest = localStorage.getItem("isGuest");

    if (storedIsGuest === "true") {
      setIsGuest(true);
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsGuest(false);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.removeItem("isGuest");
  };

  const loginAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.setItem("isGuest", "true");
    localStorage.removeItem("currentUser");
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isGuest");
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, loginUser, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
