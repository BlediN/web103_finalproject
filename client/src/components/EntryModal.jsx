export default function EntryModal({ entry, onClose }) {
  if (!entry) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          width: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <button onClick={onClose} style={{ float: "right" }}>
          X
        </button>

        <h2>
          {entry.role} @ {entry.company_name}
        </h2>

        <p><strong>Location:</strong> {entry.location}</p>
        <p><strong>Job Type:</strong> {entry.job_type}</p>
       <p>
  <strong>Layoff Date:</strong>{" "}
  {new Date(entry.layoff_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}
</p>
        <p><strong>Summary:</strong> {entry.summary}</p>
      </div>
    </div>
  );
}