export default function Step4Review({
  formData,
  selectedCompany,
  prevStep,
  handleSubmit,
  currentStep,
  totalSteps,
}) {
  return (
    <>
      <p className="step-text">
        Step {currentStep} of {totalSteps}
      </p>

      <h1 className="title">Review</h1>
      <p className="subtitle">Double-check your submission.</p>

      <div style={{ marginTop: "1.5rem", lineHeight: "1.8" }}>
        <p><strong>Company:</strong> {selectedCompany?.name || "N/A"}</p>
        <p><strong>Role:</strong> {formData.role}</p>
        <p><strong>Job Type:</strong> {formData.job_type}</p>
        <p><strong>Location:</strong> {formData.location}</p>
        <p><strong>Date:</strong> {formData.layoff_date}</p>
        <p><strong>Severance:</strong> {formData.severance_weeks}</p>
        <p><strong>Search Weeks:</strong> {formData.job_search_weeks}</p>
        <p><strong>Anonymous:</strong> {formData.is_anonymous ? "Yes" : "No"}</p>
        <p><strong>Summary:</strong> {formData.summary}</p>
      </div>

      <div className="button-row">
        <button onClick={prevStep}>Back</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  );
}