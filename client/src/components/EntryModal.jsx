import { useEffect, useState } from "react";
import "./EntryModal.css";

export default function EntryModal({
  entry,
  onClose,
  onDelete,
  onUpdate,
  deleting = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    role: "",
    job_type: "",
    location: "",
    layoff_date: "",
    severance_weeks: "",
    job_search_weeks: "",
    is_anonymous: false,
    summary: "",
  });

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

  useEffect(() => {
    if (!entry) return;

    setEditForm({
      role: entry.role || "",
      job_type: entry.job_type || "",
      location: entry.location || "",
      layoff_date: entry.layoff_date
        ? new Date(entry.layoff_date).toISOString().split("T")[0]
        : "",
      severance_weeks:
        entry.severance_weeks !== null && entry.severance_weeks !== undefined
          ? entry.severance_weeks
          : "",
      job_search_weeks:
        entry.job_search_weeks !== null && entry.job_search_weeks !== undefined
          ? entry.job_search_weeks
          : "",
      is_anonymous: Boolean(entry.is_anonymous),
      summary: entry.summary || "",
    });

    setIsEditing(false);
  }, [entry]);

  if (!entry) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (saving) return;

    if (
      !editForm.role.trim() ||
      !editForm.job_type.trim() ||
      !editForm.location.trim() ||
      !editForm.layoff_date ||
      editForm.severance_weeks === "" ||
      editForm.job_search_weeks === "" ||
      !editForm.summary.trim()
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      setSaving(true);

      await onUpdate(entry.id, {
        ...entry,
        role: editForm.role.trim(),
        job_type: editForm.job_type.trim(),
        location: editForm.location.trim(),
        layoff_date: editForm.layoff_date,
        severance_weeks: Number(editForm.severance_weeks),
        job_search_weeks: Number(editForm.job_search_weeks),
        is_anonymous: editForm.is_anonymous,
        summary: editForm.summary.trim(),
      });

      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Failed to update entry:", error);
      alert("Failed to update entry.");
    } finally {
      setSaving(false);
    }
  };

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

        {!isEditing ? (
          <>
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
              {[
                ["Location", entry.location || "Unknown"],
                ["Job Type", entry.job_type || "Unknown"],
                ["Layoff Date", formattedDate],
                [
                  "Severance",
                  entry.severance_weeks !== null &&
                  entry.severance_weeks !== undefined
                    ? `${entry.severance_weeks} week${
                        entry.severance_weeks === 1 ? "" : "s"
                      }`
                    : "N/A",
                ],
                [
                  "Job Search Time",
                  entry.job_search_weeks !== null &&
                  entry.job_search_weeks !== undefined
                    ? `${entry.job_search_weeks} week${
                        entry.job_search_weeks === 1 ? "" : "s"
                      }`
                    : "N/A",
                ],
                ["Visibility", entry.is_anonymous ? "Anonymous" : "Named"],
              ].map(([label, value]) => (
                <div
                  key={label}
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
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "1rem",
                      color: "#0f172a",
                      fontWeight: 600,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                padding: "1.15rem",
                marginBottom: "1.25rem",
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

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={onClose}
                disabled={saving || deleting}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  color: "#334155",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>

              <button
                onClick={() => setIsEditing(true)}
                disabled={saving || deleting}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Edit Story
              </button>

              <button
                onClick={() => onDelete(entry.id)}
                disabled={saving || deleting}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ paddingRight: "3rem", marginBottom: "1.25rem" }}>
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
                Edit Story
              </h2>

              <p
                style={{
                  marginTop: 0,
                  color: "#64748b",
                  fontSize: "1rem",
                }}
              >
                Update the story details below.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "0.9rem",
                marginBottom: "1.25rem",
              }}
            >
              <input
                name="role"
                value={editForm.role}
                onChange={handleChange}
                placeholder="Role"
                style={inputStyle}
              />

              <select
                name="job_type"
                value={editForm.job_type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>

              <input
                name="location"
                value={editForm.location}
                onChange={handleChange}
                placeholder="Location"
                style={inputStyle}
              />

              <input
                type="date"
                name="layoff_date"
                value={editForm.layoff_date}
                onChange={handleChange}
                style={inputStyle}
              />

              <input
                type="number"
                name="severance_weeks"
                value={editForm.severance_weeks}
                onChange={handleChange}
                placeholder="Severance weeks"
                style={inputStyle}
              />

              <input
                type="number"
                name="job_search_weeks"
                value={editForm.job_search_weeks}
                onChange={handleChange}
                placeholder="Job search weeks"
                style={inputStyle}
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.55rem",
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  name="is_anonymous"
                  checked={editForm.is_anonymous}
                  onChange={handleChange}
                />
                Submit anonymously
              </label>

              <textarea
                name="summary"
                value={editForm.summary}
                onChange={handleChange}
                placeholder="Experience"
                rows={5}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "120px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={() => setIsEditing(false)}
                disabled={saving}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff",
                  color: "#334155",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.9rem 1rem",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "1rem",
  color: "#0f172a",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
};