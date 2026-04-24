export default function Step4Review({
  formData,
  companyNameForReview,
  prevStep,
  handleSubmit,
  currentStep,
  totalSteps,
  submitting,
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--muted)",
          marginBottom: "0.5rem",
          fontWeight: 600,
        }}
      >
        Step {currentStep} of {totalSteps}
      </p>

      <h2 style={{ marginBottom: "1rem" }}>Review Your Entry</h2>

      <div
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--text)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "1.5rem",
          lineHeight: 1.8,
        }}
      >
        <p style={{ color: "var(--text)" }}>
          <strong>Company:</strong> {companyNameForReview || "N/A"}
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Role:</strong> {formData.role || "N/A"}
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Job Type:</strong> {formData.job_type || "N/A"}
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Location:</strong> {formData.location || "N/A"}
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Layoff Date:</strong> {formData.layoff_date || "N/A"}
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Severance Weeks:</strong>{" "}
          {formData.severance_weeks !== "" ? formData.severance_weeks : "N/A"}
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Job Search Weeks:</strong>{" "}
          {formData.job_search_weeks !== "" ? formData.job_search_weeks : "N/A"}
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Anonymous:</strong> {formData.is_anonymous ? "Yes" : "No"}
        </p>
        <p style={{ color: "var(--text)" }}>
          <strong>Summary:</strong> {formData.summary || "N/A"}
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" onClick={prevStep} disabled={submitting}>
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Story"}
        </button>
      </div>
    </div>
  );
}
