import { useState } from "react";

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    name: "",
    location: "",
    website: "",
    about: ""
  });

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h3>Company Profile</h3>

      <input
        name="name"
        placeholder="Company Name"
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
        name="website"
        placeholder="Website"
        className="form-control mb-2"
        onChange={handleChange}
      />

      <textarea
        name="about"
        placeholder="About company"
        className="form-control mb-2"
        onChange={handleChange}
      />

      <button className="btn btn-primary">Save Profile</button>
    </div>
  );
}
