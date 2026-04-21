export default function EntryModal({ entry, onClose }) {
  if (!entry) return null;

  const formattedDate = entry.layoff_date
    ? new Date(entry.layoff_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  const labelStyle = {
    color: "#6b7280",
    fontWeight: 600,
  };

  const valueStyle = {
    color: "#111827",
    fontWeight: 500,
  };

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
          padding: "1.75rem",
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
            marginBottom: "1.25rem",
            gap: "1rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#111827" }}>
              {entry.role} @ {entry.company_name}
            </h2>
            <p style={{ marginTop: "0.45rem", color: "#6b7280" }}>
              Full story details
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "1px solid #d1d5db",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              borderRadius: "8px",
              padding: "0.45rem 0.75rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            X
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.95rem",
            lineHeight: 1.6,
            alignItems: "flex-start",
            textAlign: "left",
          }}
        >
          <p style={{ margin: 0 }}>
            <span style={labelStyle}>Location:</span>{" "}
            <span style={valueStyle}>{entry.location || "N/A"}</span>
          </p>

          <p style={{ margin: 0 }}>
            <span style={labelStyle}>Job Type:</span>{" "}
            <span style={valueStyle}>{entry.job_type || "N/A"}</span>
          </p>

          <p style={{ margin: 0 }}>
            <span style={labelStyle}>Layoff Date:</span>{" "}
            <span style={valueStyle}>{formattedDate}</span>
          </p>

          <p style={{ margin: 0 }}>
            <span style={labelStyle}>Severance Weeks:</span>{" "}
            <span style={valueStyle}>
              {entry.severance_weeks ?? "N/A"}
            </span>
          </p>

          <p style={{ margin: 0 }}>
            <span style={labelStyle}>Job Search Weeks:</span>{" "}
            <span style={valueStyle}>
              {entry.job_search_weeks ?? "N/A"}
            </span>
          </p>

          <p style={{ margin: 0 }}>
            <span style={labelStyle}>Anonymous:</span>{" "}
            <span style={valueStyle}>{entry.is_anonymous ? "Yes" : "No"}</span>
          </p>

          <div
            style={{
              marginTop: "0.5rem",
              padding: "1rem",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              backgroundColor: "#f9fafb",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                marginTop: 0,
                marginBottom: "0.5rem",
                color: "#6b7280",
                fontWeight: 600,
              }}
            >
              Summary
            </p>
            <p
              style={{
                margin: 0,
                color: "#111827",
                lineHeight: 1.6,
              }}
            >
              {entry.summary || "No summary provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}