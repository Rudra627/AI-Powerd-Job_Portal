import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "https://dt20tzx0-5000.inc1.devtunnels.ms";

export default function MyJobs() {

  const token = localStorage.getItem("token");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await fetch(`${API}/company/my-jobs`, {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      if (!res.ok) return toast.error("Failed");

      setJobs(data.jobs);
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="container mt-4">
      <h4>My Jobs</h4>

      {jobs.map(j => (
        <div key={j.id} className="card p-3 mb-2">
          <h6>{j.title}</h6>
          <p>{j.location}</p>
          <small>{j.job_type}</small>
        </div>
      ))}
    </div>
  );
}
