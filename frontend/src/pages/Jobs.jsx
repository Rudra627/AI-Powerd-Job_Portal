import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from "../components/Navbar";
import api from "../utils/api";

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
          <div>Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <p>No open jobs available at the moment.</p>
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title text-dark fw-bold mb-3">{job.title}</h5>
                    <p className="card-text mb-2">
                      <strong>Type:</strong> <span className="badge bg-info text-dark">{job.employment_type}</span>
                    </p>
                    <p className="card-text mb-2">
                      <strong>Salary:</strong> ₹{job.salary_max}
                    </p>
                    <p className="card-text mb-3 text-muted small">
                      {job.number_of_applications} {job.number_of_applications === 1 ? 'application' : 'applications'}
                    </p>
                    <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm w-100">
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
