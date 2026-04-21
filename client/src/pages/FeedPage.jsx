import { useEffect, useState } from "react";
import axios from "axios";
import EntryModal from "../components/EntryModal";

export default function FeedPage() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

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

      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        entries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              cursor: "pointer",
            }}
          >
            <h3>
              {entry.role} @ {entry.company_name}
            </h3>
            <p>{entry.summary}</p>
            <small>
              {entry.location} • {entry.job_type} • Laid off:{" "}
              {new Date(entry.layoff_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </small>
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