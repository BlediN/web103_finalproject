import { useEffect, useState } from "react";
import axios from "axios";

export default function FeedPage() {
  const [entries, setEntries] = useState([]);

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
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>
              {entry.role} @ {entry.company_name}
            </h3>
            <p>{entry.summary}</p>
            <small>
              {entry.location} • {entry.job_type}
            </small>
          </div>
        ))
      )}
    </div>
  );
}