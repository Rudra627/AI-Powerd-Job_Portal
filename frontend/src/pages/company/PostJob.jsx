import { useState } from "react";

export default function PostJob() {
  const [job, setJob] = useState({
    title: "",
    location: "",
    salary: "",
    description: ""
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h3>Post a Job</h3>

      <input
        name="title"
        placeholder="Job Title"
        className="form-control mb-2"
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Location"
        className="form-control mb-2"
        onChange={handleChange}
      />

      <input
        name="salary"
        placeholder="Salary"
        className="form-control mb-2"
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Job Description"
        className="form-control mb-2"
        onChange={handleChange}
      />

      <button className="btn btn-success">Post Job</button>
    </div>
  );
}
