import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SubmitEntryPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: 1,
    company_id: "",
    role: "",
    job_type: "",
    location: "",
    layoff_date: "",
    severance_weeks: "",
    job_search_weeks: "",
    is_anonymous: false,
    summary: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3001/api/entries", {
        ...formData,
        company_id: Number(formData.company_id),
        severance_weeks: Number(formData.severance_weeks),
        job_search_weeks: Number(formData.job_search_weeks),
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting entry:", error);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h1>Submit Entry</h1>
      <p>Share your layoff experience.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginTop: "1.5rem",
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
            <option value="1">Meta</option>
            <option value="2">Google</option>
            <option value="3">Stripe</option>
          </select>
        </label>

        <label>
          Role
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
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

        <label>
          Location
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
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
          Summary
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="5"
            required
          />
        </label>

        <button type="submit">Submit Entry</button>
      </form>
    </div>
  );
}