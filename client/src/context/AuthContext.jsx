import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedIsGuest = localStorage.getItem("isGuest");

        if (storedIsGuest === "true") {
          setIsGuest(true);
          return;
        }

        const response = await axios.get("/api/users/me");
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Failed to restore auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsGuest(false);
    localStorage.removeItem("isGuest");
  };

  const loginAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.setItem("isGuest", "true");
  };

  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
    } catch (error) {
      console.error("Failed to log out from server session:", error);
    }

    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("isGuest");
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, loginUser, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
