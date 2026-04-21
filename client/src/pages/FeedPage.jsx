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
    <div style={{ marginTop: "2rem" }}>
      <h1>Feed Page</h1>

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
        <p>
          No results match your filters. Try adjusting your filters or resetting
          them.
        </p>
      ) : (
        filteredAndSortedEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <h3>
              {entry.role} @ {entry.company_name}
            </h3>

            <p>{entry.summary || "No summary provided."}</p>

            <small>
              {entry.location || "Unknown location"} •{" "}
              {entry.job_type || "Unknown job type"} • Laid off:{" "}
              {entry.layoff_date
                ? new Date(entry.layoff_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Unknown date"}
            </small>

            <p
              style={{
                marginTop: "0.75rem",
                color: "#2563eb",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Click to view full details
            </p>
          </div>
        ))
      )}

      <EntryModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}