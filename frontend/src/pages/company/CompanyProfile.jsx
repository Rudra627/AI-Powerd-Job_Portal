import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API = "https://dt20tzx0-5000.inc1.devtunnels.ms";

export default function CompanyProfile() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [company, setCompany] = useState({
    name: "",
    email: "",
    contact_no: "",
    website: "",
    company_type: "",
    industry_type: "",
    company_size: "",
    state: "",
    city: "",
    pincode: "",
    cin_number: "",
    gstin: "",
    udyam_number: "",
    logo: "",
    about: ""
  });

  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH ================= */

  useEffect(() => {
    if (!token) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    fetchCompany();
  }, []);

  /* ================= FETCH ================= */

const fetchCompany = async () => {
  try {
    const res = await fetch(`${API}/company/profile`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to load profile");
      return;
    }

    setCompany({
      name: data.name || "",
      email: data.email || "",
      contact_no: data.contact_no || "",
      website: data.website || "",
      company_type: data.company_type || "",
      industry_type: data.industry_type || "",
      company_size: data.company_size || "",
      state: data.state || "",
      city: data.city || "",
      pincode: data.pincode || "",
      cin_number: data.cin_number || "",
      gstin: data.gstin || "",
      udyam_number: data.udyam_number || "",
      logo: data.logo || "",
      about: data.about || ""
    });

  } catch (err) {
    console.log(err);
    toast.error("Server error");
  } finally {
    setLoading(false);
  }
};


  /* ================= CHANGE ================= */

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  /* ================= LOGO BASE64 ================= */

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompany({ ...company, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/company/company_info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify(company)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Update failed");
        return;
      }

      toast.success("Company profile updated");
      setEdit(false);
      fetchCompany();

    } catch {
      toast.error("Server error");
    }
  };

  /* ================= UI ================= */

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Company Profile</h4>

          {edit ? (
            <button className="btn btn-success btn-sm" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          )}
        </div>

        {/* LOGO */}
        <div className="text-center mb-3">
          <img
            src={company.logo || "https://via.placeholder.com/120"}
            width="120"
            height="120"
            className="rounded-circle border"
            alt="logo"
          />

          {edit && (
            <div className="mt-2">
              <input type="file" onChange={handleLogo} />
            </div>
          )}
        </div>

        {input("Company Name", "name")}
        {input("Email", "email")}
        {input("Contact Number", "contact_no")}
        {input("Website", "website")}

        {select("Company Type", "company_type",
          ["Private Limited","Public Limited","Government","LLP","Partnership","NGO","Startup"]
        )}

        {select("Industry Type", "industry_type",
          ["IT","Non-Tech","Finance","Healthcare","Education","Others"]
        )}

        {select("Company Size", "company_size",
          ["1-10","11-50","51-200","201-500","500+"]
        )}

        {input("State", "state")}
        {input("City", "city")}
        {input("Pincode", "pincode")}
        {input("CIN Number", "cin_number")}
        {input("GSTIN", "gstin")}
        {input("Udyam Number", "udyam_number")}
        {textarea("About Company", "about")}

      </div>
    </div>
  );

  /* ================= COMPONENT HELPERS ================= */

  function input(label, key) {
    return (
      <div className="mb-2">
        <label>{label}</label>
        {edit ? (
          <input
            name={key}
            value={company[key]}
            onChange={handleChange}
            className="form-control"
          />
        ) : (
          <p>{company[key] || "Not added"}</p>
        )}
      </div>
    );
  }

  function textarea(label, key) {
    return (
      <div className="mb-2">
        <label>{label}</label>
        {edit ? (
          <textarea
            name={key}
            value={company[key]}
            onChange={handleChange}
            className="form-control"
          />
        ) : (
          <p>{company[key] || "Not added"}</p>
        )}
      </div>
    );
  }

  function select(label, key, options) {
    return (
      <div className="mb-2">
        <label>{label}</label>
        {edit ? (
          <select
            name={key}
            value={company[key]}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select</option>
            {options.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ) : (
          <p>{company[key] || "Not added"}</p>
        )}
      </div>
    );
  }
}
