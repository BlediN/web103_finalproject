import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FeedPage from "./pages/FeedPage";
import SubmitEntryPage from "./pages/SubmitEntryPage";
import CompanyPage from "./pages/CompanyPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { AuthProvider, AuthContext } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const { user, isGuest, logout } = useContext(AuthContext);
  const [importingFeed, setImportingFeed] = useState(false);
  const [lastImportedCount, setLastImportedCount] = useState(null);

  const handleFeedClick = async (event) => {
    event.preventDefault();

    const now = Date.now();
    navigate("/", {
      state: {
        refreshFeed: now,
        importedCount: null,
      },
    });

    if (importingFeed) {
      return;
    }

    try {
      setImportingFeed(true);
      const response = await axios.post("http://localhost:3001/api/entries/import/gdelt");
      const importedCount = Number(response?.data?.importedCount);

      if (Number.isFinite(importedCount)) {
        setLastImportedCount(importedCount);
      }

      navigate("/", {
        state: {
          refreshFeed: Date.now(),
          importedCount: Number.isFinite(importedCount) ? importedCount : null,
        },
      });
    } catch (error) {
      console.error("Error importing external feed:", error);
    } finally {
      setImportingFeed(false);
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <div style={{ maxWidth: "var(--page-max-width)", margin: "0 auto", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 style={{ padding: "1rem 0", margin: 0, color: "var(--text)" }}>LayoffLens</h2>
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {(user || isGuest) && (
            <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 600 }}>
              {isGuest ? "Guest" : user?.username}
            </span>
          )}
          {(user || isGuest) && (
            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          )}
          {!user && !isGuest && (
            <Link
              to="/login"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#2563eb",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>

        <nav
          style={{
            display: "flex",
            gap: "1rem",
            padding: "1rem 0",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Link to="/" onClick={handleFeedClick}>
            {importingFeed ? "Feed (Importing...)" : "Feed"}
          </Link>
          {!importingFeed && lastImportedCount !== null && (
            <span
              style={{
                color: "#475569",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Imported: {lastImportedCount}
            </span>
          )}
          <Link to="/submit">Submit Entry</Link>
        </nav>

        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/submit" element={<SubmitEntryPage />} />
          <Route path="/company/:companyName" element={<CompanyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
  );
}
