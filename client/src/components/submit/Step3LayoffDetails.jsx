export default function Step3LayoffDetails({
  formData,
  handleChange,
  nextStep,
  prevStep,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <p style={{ fontSize: "0.95rem", color: "#666" }}>
        Step {currentStep} of {totalSteps}
      </p>

      <h1>Layoff Details</h1>
      <p>Share the details of your layoff experience.</p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "1.5rem",
          maxWidth: "500px",
        }}
      >
        <label>
          Location
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Remote"
            required
          />
        </label>

        <label>
          Date of Layoff
          <input
            type="date"
            name="layoff_date"
            value={formData.layoff_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Severance Weeks
          <input
            type="number"
            name="severance_weeks"
            value={formData.severance_weeks}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label>
          Job Search Weeks
          <input
            type="number"
            name="job_search_weeks"
            value={formData.job_search_weeks}
            onChange={handleChange}
            min="0"
            required
          />
        </label>

        <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input
            type="checkbox"
            name="is_anonymous"
            checked={formData.is_anonymous}
            onChange={handleChange}
          />
          Submit anonymously
        </label>

        <label>
          Experience Description
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="5"
            placeholder="Describe your experience..."
            required
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}