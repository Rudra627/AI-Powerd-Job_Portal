import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "https://dt20tzx0-5000.inc1.devtunnels.ms";

export default function Applicants() {

  const token = localStorage.getItem("token");
  const [apps, setApps] = useState([]);

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      const res = await fetch(`${API}/company/applicants`, {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      if (!res.ok) return toast.error("Failed");

      setApps(data.applicants);
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="container mt-4">
      <h4>Applicants</h4>

      {apps.map(a => (
        <div key={a.id} className="card p-3 mb-2">
          <strong>{a.name}</strong>
          <p>{a.job_title}</p>
          <a href={a.resume_url} target="_blank">View Resume</a>
        </div>
      ))}
    </div>
  );
}
