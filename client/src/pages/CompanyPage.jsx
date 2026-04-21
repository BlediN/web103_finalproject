import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import EntryModal from "../components/EntryModal";

export default function CompanyPage() {
  const { companyName } = useParams();
  const decodedCompany = decodeURIComponent(companyName);

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

  const companyEntries = entries.filter(
    (entry) => entry.company_name === decodedCompany
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        
        <Link
          to="/"
          style={{
            display: "inline-block",
            marginBottom: "1rem",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          ← Back to Feed
        </Link>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "0.5rem",
          }}
        >
          {decodedCompany} Stories
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "1.5rem",
          }}
        >
          Layoff experiences shared from professionals at {decodedCompany}.
        </p>

        {companyEntries.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              textAlign: "center",
            }}
          >
            No layoff stories found for this company yet.
          </div>
        ) : (
          companyEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "1.5rem",
                marginBottom: "1rem",
                backgroundColor: "#ffffff",
                boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
                cursor: "pointer",
              }}
            >
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#475569",
                  marginBottom: "0.4rem",
                }}
              >
                {entry.role}
              </h3>

              <p style={{ color: "#475569", marginBottom: "0.8rem" }}>
                {entry.summary || "No summary provided."}
              </p>

              <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                {entry.location} • {entry.job_type} •{" "}
                {new Date(entry.layoff_date).toLocaleDateString()}
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