import { useState } from "react";
import { toast } from "react-toastify";
import SpinnerLoader from "../../components/SpinnerLoader";

const API = import.meta.env.VITE_API_BASE_URL;

export default function PostJob() {

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const [job, setJob] = useState({
    title: "",
    description: "",
    skill_need: "",
    employment_type: "[full-time]",
    experience_min: "",
    salary_min: "",
    salary_max: "",
    location: "",
    is_remote: "no",
    close_on: ""
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

    if (!job.title || !job.description || !job.location) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/company/post_job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(job)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to post job");
        setLoading(false);
        return;
      }

      toast.success("Job posted successfully 🚀");

      // Clear form
      setJob({
        title: "",
        description: "",
        skill_need: "",
        employment_type: "full-time",
        experience_min: "",
        salary_min: "",
        salary_max: "",
        location: "",
        is_remote: "no",
        close_on: ""
      });

    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      <div className="card shadow-sm p-4">
        <h4 className="mb-3">Post New Job</h4>

        {/* Job Title */}
        <input
          className="form-control mb-3"
          placeholder="Job Title"
          name="title"
          value={job.title}
          onChange={handleChange}
        />

        {/* Description */}
        <textarea
          className="form-control mb-3"
          placeholder="Job Description"
          rows="4"
          name="description"
          value={job.description}
          onChange={handleChange}
        />

        {/* Skills */}
        <input
          className="form-control mb-3"
          placeholder="Required Skills (React, Node, SQL)"
          name="skill_need"
          value={job.skill_need}
          onChange={handleChange}
        />

        {/* Employment Type */}
        <select
          className="form-control mb-3"
          name="employment_type"
          value={job.employment_type}
          onChange={handleChange}
        >
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>

        {/* Experience */}
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Minimum Experience (Years)"
          name="experience_min"
          value={job.experience_min}
          onChange={handleChange}
        />

        {/* Salary */}
        <div className="row">
          <div className="col-md-6">
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Min Salary"
              name="salary_min"
              value={job.salary_min}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Max Salary"
              name="salary_max"
              value={job.salary_max}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Location */}
        <input
          className="form-control mb-3"
          placeholder="Location"
          name="location"
          value={job.location}
          onChange={handleChange}
        />

        {/* Remote */}
        <select
          className="form-control mb-3"
          name="is_remote"
          value={job.is_remote}
          onChange={handleChange}
        >
          <option value="no">On-site</option>
          <option value="yes">Remote</option>
        </select>

        {/* Closing Date */}
        <input
          type="date"
          className="form-control mb-3"
          name="close_on"
          value={job.close_on}
          onChange={handleChange}
        />

        {/* Submit */}
        <button
          className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
          onClick={handleSubmit}
          disabled={loading}
          style={{ height: "45px" }}
        >
          {loading ? (
            <>
              <SpinnerLoader size="1.5rem" color="#ffffff" />
              <span>Posting Job...</span>
            </>
          ) : (
            "Post Job"
          )}
        </button>

      </div>

    </div>
  );
}
