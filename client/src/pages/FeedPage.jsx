import { useEffect, useState } from "react";
import axios from "axios";
import EntryModal from "../components/EntryModal";
import FeedControls from "../components/FeedControls";
import useFeedFilters from "../hooks/useFeedFilters";

export default function FeedPage() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const {
    companyFilter,
    setCompanyFilter,
    jobTypeFilter,
    setJobTypeFilter,
    sortOrder,
    setSortOrder,
    handleResetFilters,
    uniqueCompanies,
    filteredAndSortedEntries,
  } = useFeedFilters(entries);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/entries");
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

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
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "0.35rem",
          }}
        >
          Browse Layoff Stories
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          Real experiences shared by professionals across companies.
        </p>

        <FeedControls
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          jobTypeFilter={jobTypeFilter}
          setJobTypeFilter={setJobTypeFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          uniqueCompanies={uniqueCompanies}
          onReset={handleResetFilters}
        />

        {filteredAndSortedEntries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
            }}
          >
            <p
              style={{
                marginBottom: "0.9rem",
                color: "#334155",
                fontSize: "1rem",
              }}
            >
              No results match your filters.
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
          filteredAndSortedEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 24px rgba(15, 23, 42, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 6px 18px rgba(15, 23, 42, 0.04)";
              }}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: "1rem",
                backgroundColor: "#ffffff",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <h3
                style={{
                  marginBottom: "0.4rem",
                  fontSize: "1.75rem",
                  fontWeight: 600,
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                {entry.role} @ {entry.company_name}
              </h3>

              <p
                style={{
                  color: "#475569",
                  marginBottom: "0.9rem",
                  fontSize: "1.05rem",
                  textAlign: "center",
                }}
              >
                {entry.summary || "No summary provided."}
              </p>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "0.98rem",
                  marginBottom: "0.9rem",
                  textAlign: "center",
                }}
              >
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

              <p
                style={{
                  marginTop: "0.5rem",
                  color: "#2563eb",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                View Details →
              </p>
            </div>
          ))
        )}

        <EntryModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      </div>
    </div>
  );
}