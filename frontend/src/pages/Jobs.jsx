import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from "../components/Navbar";
import api from "../utils/api";
import SpinnerLoader from "../components/SpinnerLoader";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/seeker/job_openings');
        if (res.data && res.data.jobs) {
          setJobs(res.data.jobs);
        } else {
          toast.error("Failed to load jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error(error.response?.data?.error || "Error fetching jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <>

      <div className="container mt-4">
        <h3 className="mb-4 text-primary">Job Openings</h3>
        
        {loading ? (
          <div className="text-center mt-5 pt-4"><SpinnerLoader size="3rem" color="#0d6efd" /></div>
        ) : jobs.length === 0 ? (
          <p>No open jobs available at the moment.</p>
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border border-light" style={{ transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)'; }}>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark fw-bold mb-1 text-truncate" title={job.title}>{job.title}</h5>
                    <h6 className="text-secondary mb-3 small">
                      <i className="bi bi-building me-1"></i>{job.company_name || 'Hiring Company'}
                    </h6>

                    <div className="mb-3 flex-grow-1">
                      <div className="d-flex align-items-center mb-2 text-muted small">
                        <i className="bi bi-geo-alt text-primary me-2"></i>
                        <span className="text-truncate">{job.location || 'Location Not Specified'}</span>
                      </div>
                      
                      <div className="d-flex align-items-center mb-2 text-muted small">
                        <i className="bi bi-briefcase text-primary me-2"></i>
                        <span>{job.experience_min ? `${job.experience_min}+ Years Experience` : 'Experience Not Specified'}</span>
                      </div>

                      <div className="d-flex align-items-center mb-3 text-muted small">
                        <i className="bi bi-currency-rupee text-primary me-2"></i>
                        <span>
                          {job.salary_min && job.salary_max 
                            ? `₹${job.salary_min} - ₹${job.salary_max}` 
                            : job.salary_max ? `Up to ₹${job.salary_max}` : 'Salary Not Disclosed'}
                        </span>
                      </div>

                      <div className="d-flex flex-wrap gap-2 mt-auto">
                        <span className="badge bg-light text-dark border px-2 py-1">{job.employment_type || 'Full-time'}</span>
                        <span className="badge bg-info text-white px-2 py-1">
                          {job.number_of_applications || 0} {job.number_of_applications === 1 ? 'Applicant' : 'Applicants'}
                        </span>
                      </div>
                    </div>

                    <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary w-100 fw-semibold mt-auto" style={{ borderRadius: '8px' }}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
