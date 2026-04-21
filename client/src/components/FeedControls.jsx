export default function FeedControls({
  companyFilter,
  setCompanyFilter,
  jobTypeFilter,
  setJobTypeFilter,
  sortOrder,
  setSortOrder,
  uniqueCompanies,
  onReset,
}) {
  const isDefault =
    companyFilter === "" &&
    jobTypeFilter === "" &&
    sortOrder === "newest";

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        alignItems: "center",
        padding: "1rem",
        borderRadius: "14px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
        marginBottom: "1.5rem",
      }}
    >
      <select
        value={companyFilter}
        onChange={(e) => setCompanyFilter(e.target.value)}
        style={{
          padding: "0.75rem 0.9rem",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          fontSize: "0.95rem",
        }}
      >
        <option value="">All Companies</option>
        {uniqueCompanies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>

      <select
        value={jobTypeFilter}
        onChange={(e) => setJobTypeFilter(e.target.value)}
        style={{
          padding: "0.75rem 0.9rem",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          fontSize: "0.95rem",
        }}
      >
        <option value="">All Job Types</option>
        <option value="Full-time">Full-time</option>
        <option value="Contract">Contract</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        style={{
          padding: "0.75rem 0.9rem",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          fontSize: "0.95rem",
        }}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <button
        onClick={onReset}
        disabled={isDefault}
        style={{
          padding: "0.75rem 1rem",
          borderRadius: "10px",
          border: "none",
          backgroundColor: isDefault ? "#94a3b8" : "#2563eb",
          color: "white",
          fontWeight: 600,
          cursor: isDefault ? "not-allowed" : "pointer",
          opacity: isDefault ? 0.7 : 1,
          transition: "background-color 0.2s ease",
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}