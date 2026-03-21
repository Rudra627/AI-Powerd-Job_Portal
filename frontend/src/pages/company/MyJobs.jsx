import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.get("/company/company_jobs");
      const data = res.data;

      // API returns { "res": [...] } or { "res": "No Job Found" }
      if (data.res && Array.isArray(data.res)) {
        setJobs(data.res);
      } else if (data.jobs && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
      }
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">My Posted Jobs</h4>
        <span className="badge bg-primary fs-6">{jobs.length} Jobs</span>
      </div>

      {jobs.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-briefcase fs-1 d-block mb-2"></i>
          <p>No jobs posted yet.</p>
        </div>
      )}

      {jobs.map(j => (
        <div key={j.id} className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h5 className="fw-bold text-dark mb-1">{j.title}</h5>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <span className="badge bg-primary-subtle text-primary">
                    <i className="bi bi-people me-1"></i>
                    {j.number_of_applications || 0} Applicants
                  </span>
                  {j.created_at && (
                    <span className="badge bg-light text-muted border">
                      <i className="bi bi-calendar me-1"></i>
                      Posted: {new Date(j.created_at).toLocaleDateString()}
                    </span>
                  )}
                  {j.close_on && (
                    <span className="badge bg-warning-subtle text-dark border">
                      <i className="bi bi-clock me-1"></i>
                      Closes: {new Date(j.close_on).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-people me-1"></i> View Applicants
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
