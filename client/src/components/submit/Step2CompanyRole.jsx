export default function Step2CompanyRole({
  formData,
  handleChange,
  nextStep,
  prevStep,
  companies,
  currentStep,
  totalSteps,
}) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <p style={{ fontSize: "0.95rem", color: "#666" }}>
        Step {currentStep} of {totalSteps}
      </p>

      <h1>Company + Role Information</h1>
      <p>Tell us where you worked and what role was affected.</p>

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
          Company
          <select
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
            required
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Role / Job Title
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Frontend Engineer"
            required
          />
        </label>

        <label>
          Job Type
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            required
          >
            <option value="">Select job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}