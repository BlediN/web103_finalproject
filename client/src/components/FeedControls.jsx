import { useNavigate } from "react-router-dom";

export default function FeedControls({
  companyFilter,
  setCompanyFilter,
  jobTypeFilter,
  setJobTypeFilter,
  sortOrder,
  setSortOrder,
  searchTerm,
  setSearchTerm,
  uniqueCompanies,
  onReset,
}) {
  const navigate = useNavigate();

  const isDefault =
    companyFilter === "" &&
    jobTypeFilter === "" &&
    sortOrder === "newest" &&
    searchTerm === "";

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "14px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by company, role, or keyword..."
          style={{
            width: "100%",
            padding: "0.85rem 1rem",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#ffffff",
            color: "#0f172a",
            fontSize: "0.95rem",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          value={companyFilter}
          onChange={(e) => {
            const selectedCompany = e.target.value;
            setCompanyFilter(selectedCompany);

            if (selectedCompany) {
              navigate(`/company/${encodeURIComponent(selectedCompany)}`);
            }
          }}
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
    </div>
  );
}