import { useState } from "react";

export default function Step2CompanyRole({
  formData,
  handleChange,
  nextStep,
  prevStep,
  companies,
  currentStep,
  totalSteps,
}) {
  const [clickedButton, setClickedButton] = useState(null);

  const handleNext = () => {
    setClickedButton("next");
    nextStep();
  };

  const handlePrev = () => {
    setClickedButton("back");
    prevStep();
  };

  return (
    <>
      <p className="step-text">
        Step {currentStep} of {totalSteps}
      </p>

      <h1 className="title">Company + Role</h1>
      <p className="subtitle">
        Tell us where you worked and your role.
      </p>

      <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="form-group">
          <label>Company</label>
          <select
            name="company_id"
            value={formData.company_id}
            onChange={handleChange}
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <small style={{ color: "#64748b", marginTop: "0.35rem" }}>
            Can&apos;t find it? Enter it below.
          </small>
        </div>

        <div className="form-group">
          <label>Company (if not listed)</label>
          <input
            type="text"
            name="custom_company_name"
            value={formData.custom_company_name}
            onChange={handleChange}
            placeholder="e.g. Acme Labs"
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Frontend Engineer"
            required
          />
        </div>

        <div className="form-group">
          <label>Job Type</label>
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
        </div>
      </div>

      <div className="button-row">
        <button onClick={handlePrev} disabled={clickedButton === "back"}>
          Back
        </button>
        <button onClick={handleNext} disabled={clickedButton === "next"}>
          Next
        </button>
      </div>
    </>
  );
}
