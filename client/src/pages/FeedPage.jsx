import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import EntryModal from "../components/EntryModal";
import FeedControls from "../components/FeedControls";
import useFeedFilters from "../hooks/useFeedFilters";

export default function FeedPage() {
  const location = useLocation();

  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchEntries = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/entries");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
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

      {filteredAndSortedEntries.map((entry) => (
        <div key={entry.id} className="card">
          <h3>
            {entry.role} @{" "}
            <span style={{ color: "#2563eb" }}>{entry.company_name}</span>
          </h3>

          <p>{entry.summary}</p>

          <p>
            {entry.location} • {entry.job_type} •{" "}
            {new Date(entry.layoff_date).toLocaleDateString()}
          </p>

          <p>
            Severance: {entry.severance_weeks} weeks • Job search:{" "}
            {entry.job_search_weeks} weeks •{" "}
            {entry.is_anonymous ? "Anonymous" : "Named"}
          </p>

          <button onClick={() => setSelectedEntry(entry)}>View Details →</button>
        </div>
      ))}

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