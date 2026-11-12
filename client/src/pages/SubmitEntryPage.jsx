import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SubmitEntryPage.css";

import Step1Intro from "../components/submit/Step1Intro";
import Step2CompanyRole from "../components/submit/Step2CompanyRole";
import Step3LayoffDetails from "../components/submit/Step3LayoffDetails";
import Step4Review from "../components/submit/Step4Review";
import Toast from "../components/Toast";
import { AuthContext } from "../context/AuthContext";

export default function SubmitEntryPage() {
  const navigate = useNavigate();
  const { user, isGuest } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    company_id: "",
    custom_company_name: "",
    role: "",
    job_type: "",
    location: "",
    layoff_date: "",
    severance_weeks: "",
    job_search_weeks: "",
    is_anonymous: false,
    summary: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setErrorMessage("Failed to load companies.");
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const nextStep = () => {
    setErrorMessage("");

    if (step === 2) {
      const hasSelectedCompany = Boolean(formData.company_id);
      const hasCustomCompany = Boolean(formData.custom_company_name.trim());
      if ((!hasSelectedCompany && !hasCustomCompany) || !formData.role || !formData.job_type) {
        setErrorMessage("Please complete all fields before continuing.");
        return;
      }
    }

    if (step === 3) {
      if (
        !formData.location ||
        !formData.layoff_date ||
        formData.severance_weeks === "" ||
        formData.job_search_weeks === "" ||
        !formData.summary
      ) {
        setErrorMessage("Please complete all fields before continuing.");
        return;
      }
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMessage("");
    setStep((prev) => prev - 1);
  };

  const selectedCompany = companies.find(
    (company) => String(company.id) === String(formData.company_id)
  );
  const companyNameForReview = selectedCompany?.name || formData.custom_company_name.trim() || "N/A";

  const handleSubmit = async () => {
    if (submitting) return;

    setErrorMessage("");

    if (!user || isGuest) {
      setErrorMessage("Please log in to submit a story.");
      navigate("/login");
      return;
    }

    setSubmitting(true);

    try {
      let companyId = Number(formData.company_id);
      const customCompanyName = formData.custom_company_name.trim();

      if (!companyId && customCompanyName) {
        const companyResponse = await axios.post("/api/companies", {
          name: customCompanyName,
        });
        companyId = Number(companyResponse.data.id);
      }

      if (!companyId) {
        setErrorMessage("Please select or enter a company.");
        setSubmitting(false);
        return;
      }

      await axios.post("/api/entries", {
        ...formData,
        company_id: companyId,
        severance_weeks: Number(formData.severance_weeks),
        job_search_weeks: Number(formData.job_search_weeks),
      });

      const companyName = companyNameForReview !== "N/A" ? companyNameForReview : null;

      if (companyName) {
        navigate(`/company/${encodeURIComponent(companyName)}`, {
          state: {
            success: `Your layoff story was submitted successfully for ${companyName}.`,
          },
        });
      } else {
        navigate("/", {
          state: {
            success: "Your layoff story was submitted successfully.",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting entry:", error);
      setErrorMessage("Failed to submit entry. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <Toast message={errorMessage} type="error" />

      <div className="card">
        {step === 1 && (
          <Step1Intro nextStep={nextStep} currentStep={step} totalSteps={4} />
        )}

        {step === 2 && (
          <Step2CompanyRole
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
            companies={companies}
            currentStep={step}
            totalSteps={4}
          />
        )}

        {step === 3 && (
          <Step3LayoffDetails
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={step}
            totalSteps={4}
          />
        )}

        {step === 4 && (
          <Step4Review
            formData={formData}
            selectedCompany={selectedCompany}
            companyNameForReview={companyNameForReview}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            currentStep={step}
            totalSteps={4}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
