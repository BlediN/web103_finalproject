import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import EntryModal from "../components/EntryModal";
import FeedControls from "../components/FeedControls";
import useFeedFilters from "../hooks/useFeedFilters";

export default function FeedPage() {
  const FEEDS_PER_PAGE = 20;
  const location = useLocation();

  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/entries");
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

  useEffect(() => {
    if (location.state?.refreshFeed) {
      fetchEntries();
    }
  }, [location.state?.refreshFeed]);

  const {
    companyFilter,
    setCompanyFilter,
    jobTypeFilter,
    setJobTypeFilter,
    sortOrder,
    setSortOrder,
    searchTerm,
    setSearchTerm,
    handleResetFilters,
    uniqueCompanies,
    filteredAndSortedEntries,
  } = useFeedFilters(entries);

  useEffect(() => {
    setCurrentPage(1);
  }, [companyFilter, jobTypeFilter, sortOrder, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedEntries.length / FEEDS_PER_PAGE)
  );

  const paginatedEntries = filteredAndSortedEntries.slice(
    (currentPage - 1) * FEEDS_PER_PAGE,
    currentPage * FEEDS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this story? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await axios.delete(`http://localhost:3001/api/entries/${id}`);
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
    try {
      await axios.patch(`http://localhost:3001/api/entries/${id}`, updatedData);
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

  return (
    <div className="wrapper">
      {successMessage && (
        <div
          style={{
            background: "#d1fae5",
            color: "#065f46",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          {successMessage}
        </div>
      )}

      <h1>Browse Layoff Stories</h1>
      <p>Real experiences shared by professionals across companies.</p>

      <FeedControls
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
        jobTypeFilter={jobTypeFilter}
        setJobTypeFilter={setJobTypeFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        uniqueCompanies={uniqueCompanies}
        onReset={handleResetFilters}
      />

      {loading ? (
        <div className="card" style={{ textAlign: "center" }}>
          Loading stories...
        </div>
      ) : filteredAndSortedEntries.length === 0 ? (
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "0.8rem" }}>
            No stories match your current filters.
          </p>
          <button
            onClick={handleResetFilters}
            style={{
              padding: "0.65rem 1rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        paginatedEntries.map((entry) => (
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
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(15, 23, 42, 0.04)";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
            style={{
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>
              {entry.role || "Unknown role"}{" "}
              <Link
                to={`/company/${encodeURIComponent(entry.company_name)}`}
                onClick={(e) => e.stopPropagation()}
                style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}
              >
                @ {entry.company_name}
              </Link>
            </h3>

            <p>{entry.summary || "No summary provided."}</p>

            <p>
              {entry.location || "Unknown location"} • {entry.job_type || "Unknown job type"} •{" "}
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
              {entry.severance_weeks !== null && entry.severance_weeks !== undefined
                ? `${entry.severance_weeks} week${entry.severance_weeks === 1 ? "" : "s"}`
                : "N/A"}{" "}
              • Job search:{" "}
              {entry.job_search_weeks !== null &&
              entry.job_search_weeks !== undefined
                ? `${entry.job_search_weeks} week${entry.job_search_weeks === 1 ? "" : "s"}`
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
                    {" "}•{" "}
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

      {!loading && filteredAndSortedEntries.length > FEEDS_PER_PAGE && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            marginTop: "1rem",
            padding: "0.9rem 1rem",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
          }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "0.6rem 0.9rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: currentPage === 1 ? "#f1f5f9" : "#ffffff",
              color: "#334155",
              fontWeight: 600,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>

          <span style={{ color: "#475569", fontWeight: 600, fontSize: "0.95rem" }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.6rem 0.9rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: currentPage === totalPages ? "#f1f5f9" : "#ffffff",
              color: "#334155",
              fontWeight: 600,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}

      {selectedEntry && (
        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          deleting={deleting}
        />
      )}
    </div>
  );
}
