import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

interface CompanyData {
  company: string;
  role: string;
  submissionCount: number;
}

const CompanySearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchCompany, setSearchCompany] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);

    // Delay showing spinner to prevent flash on fast loads
    const loadingTimer = setTimeout(() => {
      setShowLoading(true);
    }, 200);

    try {
      const response = await api.get('/interview/insights');
      const data = response.data.data;
      // Ensure data is an array
      const companiesArray = Array.isArray(data) ? data : data?.companies || [];
      setCompanies(companiesArray);
      setFilteredCompanies(companiesArray);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch companies');
      setCompanies([]);
      setFilteredCompanies([]);
    } finally {
      clearTimeout(loadingTimer);
      setLoading(false);
      setShowLoading(false);
    }
  };

  const handleSearch = () => {
    // Ensure companies is an array
    if (!Array.isArray(companies)) {
      setFilteredCompanies([]);
      return;
    }

    if (!searchCompany.trim() && !searchRole.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter((item) => {
      const companyMatch =
        !searchCompany.trim() || item.company.toLowerCase().includes(searchCompany.toLowerCase());
      const roleMatch =
        !searchRole.trim() || item.role.toLowerCase().includes(searchRole.toLowerCase());
      return companyMatch && roleMatch;
    });

    setFilteredCompanies(filtered);
  };

  const handleCompanyClick = (company: string, role: string) => {
    navigate(`/interview/insights/${encodeURIComponent(company)}/${encodeURIComponent(role)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="page-container">
        <div className="card mb-6">
          <h1 className="page-title">Interview Insights</h1>
          <p className="page-subtitle mb-6">
            Search for company interview experiences shared by the community
          </p>

          {/* Search inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-1">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field"
                placeholder="e.g., Google, Microsoft"
              />
            </div>

            <div className="md:col-span-1">
              <label className="form-label">Role</label>
              <input
                type="text"
                value={searchRole}
                onChange={(e) => setSearchRole(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input-field"
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div className="md:col-span-1 flex items-end">
              <button onClick={handleSearch} className="btn-primary w-full">
                Search
              </button>
            </div>
          </div>

          {/* Share experience button */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/interview/experience/new')}
              className="btn-primary"
              style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
            >
              Share Your Experience
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="notification-error">
            <span className="notification-content">{error}</span>
          </div>
        )}

        {/* Loading state */}
        {showLoading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="text-gray-600">Loading companies...</p>
          </div>
        )}

        {/* Results */}
        {!loading && filteredCompanies.length === 0 && (
          <div className="card empty-state">
            <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="empty-state-text">
              {searchCompany || searchRole
                ? 'Try adjusting your search criteria'
                : 'No interview experiences have been shared yet'}
            </p>
          </div>
        )}

        {!loading && filteredCompanies.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Found {filteredCompanies.length}{' '}
              {filteredCompanies.length === 1 ? 'result' : 'results'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleCompanyClick(item.company, item.role)}
                  className="card card-interactive"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.company}</h3>
                      <p className="text-gray-600">{item.role}</p>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {item.submissionCount}{' '}
                    {item.submissionCount === 1 ? 'experience' : 'experiences'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySearchPage;
