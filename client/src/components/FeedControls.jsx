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
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1.5rem",
        alignItems: "center",
      }}
    >
      <select
        value={companyFilter}
        onChange={(e) => setCompanyFilter(e.target.value)}
        style={{ padding: "0.5rem", borderRadius: "6px" }}
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
        style={{ padding: "0.5rem", borderRadius: "6px" }}
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
        style={{ padding: "0.5rem", borderRadius: "6px" }}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <button
  onClick={onReset}
  style={{
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#1d4ed8";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "#2563eb";
  }}
>
  Reset Filters
</button>
    </div>
  );
}