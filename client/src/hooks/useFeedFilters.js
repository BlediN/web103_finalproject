import { useMemo, useState } from "react";

export default function useFeedFilters(entries) {
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const handleResetFilters = () => {
    setCompanyFilter("");
    setJobTypeFilter("");
    setSortOrder("newest");
  };

  const uniqueCompanies = useMemo(() => {
    return [...new Set(entries.map((entry) => entry.company_name))];
  }, [entries]);

  const filteredAndSortedEntries = useMemo(() => {
    return [...entries]
      .filter((entry) => {
        const matchesCompany =
          companyFilter === "" || entry.company_name === companyFilter;

        const matchesJobType =
          jobTypeFilter === "" || entry.job_type === jobTypeFilter;

        return matchesCompany && matchesJobType;
      })
      .sort((a, b) => {
        const dateA = new Date(a.layoff_date);
        const dateB = new Date(b.layoff_date);

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [entries, companyFilter, jobTypeFilter, sortOrder]);

  return {
    companyFilter,
    setCompanyFilter,
    jobTypeFilter,
    setJobTypeFilter,
    sortOrder,
    setSortOrder,
    handleResetFilters,
    uniqueCompanies,
    filteredAndSortedEntries,
  };
}