import CompanyModel from "../models/CompanyModel.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await CompanyModel.getAll();
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await CompanyModel.getOne(req.params.id);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

export const createCompany = async (req, res) => {
  try {
    const { name, website = null, industry_id = null } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Company name is required" });
    }

    const trimmedName = name.trim();
    const existingCompany = await CompanyModel.findByName(trimmedName);
    if (existingCompany) {
      return res.status(200).json(existingCompany);
    }

    const createdCompany = await CompanyModel.createOne({
      name: trimmedName,
      website,
      industry_id,
    });

    return res.status(201).json(createdCompany);
  } catch (error) {
    console.error("Error creating company:", error);
    return res.status(500).json({ error: "Failed to create company" });
  }
};
