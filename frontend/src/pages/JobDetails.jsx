import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setJob(data));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <>
   

      <div className="container mt-4 ">
        <div className="card p-4 shadow-sm">
          <h4>{job.title}</h4>
          <h6 className="text-muted">{job.company}</h6>

          <p className="mt-3">{job.description}</p>

          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Experience:</strong> {job.experience}</p>

          <div className="mb-3">
            {job.skills.map((skill, i) => (
              <span key={i} className="badge bg-secondary me-2">
                {skill}
              </span>
            ))}
          </div>

          <button className="btn btn-primary">
            Apply Now
          </button>
        </div>
      </div>
    </>
  );
}
