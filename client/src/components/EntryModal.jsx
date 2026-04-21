export default function EntryModal({ entry, onClose }) {
  if (!entry) return null;

  const formattedDate = entry.layoff_date
    ? new Date(entry.layoff_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "620px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              {entry.role} @ {entry.company_name}
            </h2>
            <p style={{ marginTop: "0.5rem", color: "#666" }}>
              Full story details
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              backgroundColor: "#2563eb",
              color: "white",
              borderRadius: "8px",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
            }}
          >
            X
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
            lineHeight: 1.5,
          }}
        >
          <p>
            <strong>Location:</strong> {entry.location || "N/A"}
          </p>
          <p>
            <strong>Job Type:</strong> {entry.job_type || "N/A"}
          </p>
          <p>
            <strong>Layoff Date:</strong> {formattedDate}
          </p>
          <p>
            <strong>Severance Weeks:</strong>{" "}
            {entry.severance_weeks ?? "N/A"}
          </p>
          <p>
            <strong>Job Search Weeks:</strong>{" "}
            {entry.job_search_weeks ?? "N/A"}
          </p>
          <p>
            <strong>Anonymous:</strong> {entry.is_anonymous ? "Yes" : "No"}
          </p>

          <div
            style={{
              marginTop: "0.5rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              backgroundColor: "#f9fafb",
            }}
          >
            <p style={{ marginTop: 0, marginBottom: "0.5rem" }}>
              <strong>Summary</strong>
            </p>
            <p style={{ margin: 0 }}>{entry.summary || "No summary provided."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}