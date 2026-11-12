import { useContext, useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import EntryModal from "../components/EntryModal";
import NotFound from "./NotFound";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import { AuthContext } from "../context/AuthContext";

export default function CompanyPage() {
  const { companyName } = useParams();
  const location = useLocation();
  const { user, isGuest } = useContext(AuthContext);
  const canManagePosts = Boolean(user) && !isGuest;
  const decodedCompany = decodeURIComponent(companyName);

  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchEntries = async () => {
    try {
      const response = await axios.get("/api/entries");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
  if (location.state?.success) {
    setSuccessMessage(location.state.success);
    window.history.replaceState({}, document.title);
  }
}, [location.state]);

  const handleDelete = async (id) => {
    if (!canManagePosts) {
      alert("Please log in to delete posts.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this story? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/entries/${id}`);
      await fetchEntries();
      setSelectedEntry(null);
      setSuccessMessage("Story deleted successfully.");
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    if (!canManagePosts) {
      alert("Please log in to edit posts.");
      return;
    }

    try {
      await axios.patch(`/api/entries/${id}`, updatedData);
      await fetchEntries();
      setSelectedEntry(null);
      setSuccessMessage("Story updated successfully.");
    } catch (error) {
      console.error("Error updating entry:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const companyEntries = entries
    .filter((entry) => entry.company_name === decodedCompany)
    .sort((a, b) => new Date(b.layoff_date) - new Date(a.layoff_date));

  const companyExists =
    loading || entries.some((entry) => entry.company_name === decodedCompany);

  if (!loading && !companyExists) {
    return <NotFound />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "920px",
          margin: "0 auto",
        }}
      >
        <Toast message={successMessage} type="success" />

        <Link
          to="/"
          style={{
            display: "inline-block",
            marginBottom: "1.25rem",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.98rem",
          }}
        >
          ← Back to Feed
        </Link>

        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            {decodedCompany} Stories
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: "1.05rem",
              marginBottom: "0.85rem",
              textAlign: "center",
            }}
          >
            Layoff experiences shared from professionals at {decodedCompany}.
          </p>

          {!loading && (
            <div
              style={{
                display: "block",
                width: "fit-content",
                margin: "0 auto",
                padding: "0.5rem 0.85rem",
                borderRadius: "999px",
                backgroundColor: "#e0f2fe",
                color: "#0369a1",
                fontSize: "0.9rem",
                fontWeight: 700,
              }}
            >
              {companyEntries.length} stor{companyEntries.length === 1 ? "y" : "ies"}
            </div>
          )}
        </div>

        {loading ? (
          <Spinner />
        ) : companyEntries.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#334155",
                fontSize: "1rem",
                marginBottom: "1rem",
              }}
            >
              No layoff stories found for {decodedCompany} yet.
            </p>

            <Link
              to="/submit"
              style={{
                display: "inline-block",
                padding: "0.7rem 1rem",
                borderRadius: "10px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Submit the first story
            </Link>
          </div>
        ) : (
          companyEntries.map((entry) => (
            <div
              key={entry.id}
              className="card"
              onClick={() => setSelectedEntry(entry)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 24px rgba(15, 23, 42, 0.08)";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(15, 23, 42, 0.04)";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
              style={{
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <h3>{entry.role}</h3>

              <p>{entry.summary || "No summary provided."}</p>

              <p>
                {entry.location || "Unknown location"} •{" "}
                {entry.job_type || "Unknown job type"} •{" "}
                {entry.layoff_date
                  ? new Date(entry.layoff_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Unknown date"}
              </p>

              <p>
                Severance:{" "}
                {entry.severance_weeks !== null &&
                entry.severance_weeks !== undefined
                  ? `${entry.severance_weeks} week${
                      entry.severance_weeks === 1 ? "" : "s"
                    }`
                  : "N/A"}{" "}
                • Job search:{" "}
                {entry.job_search_weeks !== null &&
                entry.job_search_weeks !== undefined
                  ? `${entry.job_search_weeks} week${
                      entry.job_search_weeks === 1 ? "" : "s"
                    }`
                  : "N/A"}{" "}
                • {entry.is_anonymous ? "Anonymous" : "Named"}
              </p>

              {(entry.is_external || entry.source_name) && (
                <p
                  style={{
                    color: "#475569",
                    fontSize: "0.9rem",
                    marginBottom: "0.9rem",
                    textAlign: "left",
                    fontWeight: 600,
                  }}
                >
                  Source: {entry.source_name || "External Feed"}
                  {entry.source_url ? (
                    <>
                      {" "}
                      •{" "}
                      <a
                        href={entry.source_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read Article
                      </a>
                    </>
                  ) : null}
                </p>
              )}

              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.55rem 0.9rem",
                    backgroundColor: entry.is_external ? "#fef9c3" : "#eff6ff",
                    color: entry.is_external ? "#854d0e" : "#2563eb",
                    borderRadius: "999px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {entry.is_external ? "External Report" : "View Details →"}
                </span>
              </div>
            </div>
          ))
        )}

        {selectedEntry && (
          <EntryModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            deleting={deleting}
            canManagePosts={canManagePosts}
          />
        )}
      </div>
    </div>
  );
}
