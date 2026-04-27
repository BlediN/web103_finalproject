import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Toast from "../components/Toast";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser, loginAsGuest, user, isGuest } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      setErrorMessage("Username is required.");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    if (isRegistering && !trimmedEmail) {
      setErrorMessage("Email is required for registration.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const endpoint = isRegistering
        ? "/api/users/register"
        : "/api/users/login";

      const payload = isRegistering
        ? { username: trimmedUsername, email: trimmedEmail, password }
        : { username: trimmedUsername, password };

      const response = await axios.post(endpoint, payload);
      loginUser(response.data.user);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate("/");
  };

  if (user && !isGuest) {
    return (
      <div className="wrapper" style={{ textAlign: "center", paddingTop: "2rem" }}>
        <div className="card">
          <h1 style={{ color: "#0f172a", marginBottom: "1rem" }}>Welcome Back</h1>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            Logged in as: <strong>{user.username}</strong>
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="wrapper" style={{ textAlign: "center", paddingTop: "2rem" }}>
        <div className="card">
          <h1 style={{ color: "#0f172a", marginBottom: "1rem" }}>Guest Mode Active</h1>
          <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
            Guests can browse imported stories, but submitting and managing stories requires login.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Toast message={errorMessage} type="error" />

      <div className="card">
        <h1 style={{ color: "#0f172a", marginBottom: "1rem" }}>
          {isRegistering ? "Create Account" : "Log In"}
        </h1>

        <form onSubmit={handleAuthSubmit} style={{ marginBottom: "1.5rem" }}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.75rem",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Processing..." : isRegistering ? "Register" : "Log In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegistering((prev) => !prev);
                resetForm();
              }}
              style={{
                flex: 1,
                padding: "0.75rem",
                backgroundColor: "#64748b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {isRegistering ? "Back to Login" : "Register"}
            </button>
          </div>
        </form>

        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "1.5rem",
          }}
        >
          <p style={{ color: "#64748b", marginBottom: "1rem", textAlign: "center" }}>
            Or continue as guest
          </p>
          <button
            onClick={handleGuestLogin}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
