import { useEffect } from "react";

export default function EntryModal({ entry, onClose }) {
  useEffect(() => {
    if (!entry) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const formattedDate = entry.layoff_date
    ? new Date(entry.layoff_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
          border: "1px solid #e5e7eb",
          padding: "1.75rem",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            backgroundColor: "#f8fafc",
            color: "#334155",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <div style={{ paddingRight: "3rem" }}>
          <h2
            style={{
              margin: 0,
              marginBottom: "0.35rem",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.2,
            }}
          >
            {entry.role || "Unknown role"}{" "}
            <span style={{ color: "#2563eb" }}>
              @ {entry.company_name || "Unknown company"}
            </span>
          </h2>

          <p
            style={{
              marginTop: 0,
              marginBottom: "1.5rem",
              color: "#64748b",
              fontSize: "1rem",
            }}
          >
            Full story details
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#64748b",
                marginBottom: "0.35rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Location
            </div>
            <div style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 600 }}>
              {entry.location || "Unknown"}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#64748b",
                marginBottom: "0.35rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Job Type
            </div>
            <div style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 600 }}>
              {entry.job_type || "Unknown"}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#64748b",
                marginBottom: "0.35rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Layoff Date
            </div>
            <div style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 600 }}>
              {formattedDate}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#64748b",
                marginBottom: "0.35rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Severance
            </div>
            <div style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 600 }}>
              {entry.severance_weeks !== null && entry.severance_weeks !== undefined
                ? `${entry.severance_weeks} week${entry.severance_weeks === 1 ? "" : "s"}`
                : "N/A"}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#64748b",
                marginBottom: "0.35rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Job Search Time
            </div>
            <div style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 600 }}>
              {entry.job_search_weeks !== null && entry.job_search_weeks !== undefined
                ? `${entry.job_search_weeks} week${entry.job_search_weeks === 1 ? "" : "s"}`
                : "N/A"}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#64748b",
                marginBottom: "0.35rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              Visibility
            </div>
            <div style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 600 }}>
              {entry.is_anonymous ? "Anonymous" : "Named"}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "1.15rem",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#334155",
              marginBottom: "0.75rem",
            }}
          >
            Summary
          </div>

          <p
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "1rem",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {entry.summary || "No summary provided."}
          </p>
        </div>
      </div>
    </div>
  );
}