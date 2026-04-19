export default function Step4Review({
  formData,
  selectedCompany,
  prevStep,
  handleSubmit,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <p style={{ fontSize: "0.95rem", color: "#666" }}>
        Step {currentStep} of {totalSteps}
      </p>

      <h1>Review Your Story</h1>
      <p>Double-check everything before submitting.</p>

      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          maxWidth: "600px",
        }}
      >
        <p>
          <strong>Company:</strong> {selectedCompany ? selectedCompany.name : "N/A"}
        </p>
        <p>
          <strong>Role:</strong> {formData.role}
        </p>
        <p>
          <strong>Job Type:</strong> {formData.job_type}
        </p>
        <p>
          <strong>Location:</strong> {formData.location}
        </p>
        <p>
          <strong>Date of Layoff:</strong> {formData.layoff_date}
        </p>
        <p>
          <strong>Severance Weeks:</strong> {formData.severance_weeks}
        </p>
        <p>
          <strong>Job Search Weeks:</strong> {formData.job_search_weeks}
        </p>
        <p>
          <strong>Anonymous:</strong> {formData.is_anonymous ? "Yes" : "No"}
        </p>
        <p>
          <strong>Summary:</strong> {formData.summary}
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button onClick={prevStep}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}