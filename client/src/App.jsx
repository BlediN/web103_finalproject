import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FeedPage from "./pages/FeedPage";
import SubmitEntryPage from "./pages/SubmitEntryPage";
import CompanyPage from "./pages/CompanyPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const [importingFeed, setImportingFeed] = useState(false);
  const [lastImportedCount, setLastImportedCount] = useState(null);

  const handleFeedClick = async (event) => {
    event.preventDefault();

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
      navigate("/", { state: { refreshFeed: Date.now(), importedCount: null } });
    } finally {
      setImportingFeed(false);
    }
  };

  return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "1rem" }}>
        <h2 style={{ padding: "1rem 0" }}>LayoffLens</h2>

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
          <Route path="/submit" element={<SubmitEntryPage />} />
          <Route path="/company/:companyName" element={<CompanyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
  );
}
