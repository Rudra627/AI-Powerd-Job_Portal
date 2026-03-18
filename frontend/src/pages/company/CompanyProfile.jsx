import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";

const API = import.meta.env.VITE_API_BASE_URL;

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
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (!token) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await fetch(`${API}/company/profile`, {
        method: "GET",
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to load profile");
        return;
      }
      setCompany(data);
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCompany({ ...company, logo: reader.result });
    reader.readAsDataURL(file);
  };

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
      if (!res.ok) {
        const data = await res.json();
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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4 mb-5">
      <div className="profile-container">
        
        {/* LEFT SIDEBAR */}
        <div className="profile-left-sidebar">
          <img src={company.logo || "https://via.placeholder.com/150"} className="profile-photo" alt="logo" />
          <input type="file" id="logo-upload" hidden onChange={handleLogo} />
          <label htmlFor="logo-upload" className="btn btn-sm btn-outline-primary mb-3">Change Logo</label>

          <div className="profile-sidebar-section">
            <div className="profile-sidebar-title">Company Info</div>
            <div className="profile-sidebar-item">
              <div className="profile-sidebar-label">Industry</div>
              <div className="profile-sidebar-value">{company.industry_type || "Not set"}</div>
            </div>
            <div className="profile-sidebar-item">
              <div className="profile-sidebar-label">Size</div>
              <div className="profile-sidebar-value">{company.company_size || "Not set"} Employees</div>
            </div>
            <div className="profile-sidebar-item">
              <div className="profile-sidebar-label">Type</div>
              <div className="profile-sidebar-value">{company.company_type || "Not set"}</div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="profile-main-content">
          <div className="profile-header-top">
            <div>
              <h1 className="profile-name">{company.name}</h1>
              <div className="profile-location">
                <i className="bi bi-geo-alt"></i> {company.city}, {company.state}
              </div>
              <a href={company.website} target="_blank" rel="noreferrer" className="text-primary text-decoration-none fw-semibold mt-1">
                {company.website || "No website set"}
              </a>

              <div className="profile-rankings">
                <div className="profile-rank-label">Rating</div>
                <div className="d-flex align-items-center gap-2">
                  <span className="profile-rank-value">4,8</span>
                  <div className="text-primary">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-half"></i>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button className="btn text-muted"><i className="bi bi-bookmark"></i> Bookmark</button>
            </div>
          </div>

          <div className="profile-btn-group">
            <button className="btn btn-outline-primary d-flex align-items-center gap-2">
              <i className="bi bi-chat-left-text"></i> Contact Sales
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <i className="bi bi-briefcase"></i> View Jobs
            </button>
            <button className="btn text-muted">Report company</button>
          </div>

          {/* TABS */}
          <div className="profile-tabs mt-4">
            <div 
              className={`profile-tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <i className="bi bi-building"></i> About
            </div>
            <div 
              className={`profile-tab ${activeTab === "legal" ? "active" : ""}`}
              onClick={() => setActiveTab("legal")}
            >
              <i className="bi bi-shield-check"></i> Legal Info
            </div>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "about" ? (
            <div className="tab-content">
              <section className="mb-4">
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Company Description</h6>
                <p className="text-muted">{company.about || "No description provided."}</p>
              </section>

              <section className="mb-4">
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Contact Information</h6>
                <div className="info-grid">
                  <div className="info-label">Phone:</div>
                  <div className="info-value blue">{company.contact_no || "Not set"}</div>
                  <div className="info-label">Address:</div>
                  <div className="info-value">{company.city}, {company.state}, {company.pincode}</div>
                  <div className="info-label">E-mail:</div>
                  <div className="info-value blue">{company.email}</div>
                  <div className="info-label">Website:</div>
                  <div className="info-value blue">{company.website}</div>
                </div>
              </section>

              <div className="mt-5 pt-3 border-top">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setEdit(true)}>Edit Company Profile</button>
              </div>
            </div>
          ) : (
            <div className="tab-content">
              <section>
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Registration Details</h6>
                <div className="info-grid">
                  <div className="info-label">CIN Number:</div>
                  <div className="info-value">{company.cin_number || "Not provided"}</div>
                  <div className="info-label">GSTIN:</div>
                  <div className="info-value">{company.gstin || "Not provided"}</div>
                  <div className="info-label">Udyam Number:</div>
                  <div className="info-value">{company.udyam_number || "Not provided"}</div>
                </div>
              </section>
            </div>
          )}

          {/* EDIT MODAL */}
          {edit && (
             <div className="modal show d-block" style={{background: "rgba(0,0,0,0.5)"}}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Company Information</h5>
                      <button type="button" className="btn-close" onClick={() => setEdit(false)}></button>
                    </div>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Company Name</label>
                          <input className="form-control" name="name" value={company.name} onChange={e => setCompany({...company, name: e.target.value})} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Website</label>
                          <input className="form-control" name="website" value={company.website} onChange={e => setCompany({...company, website: e.target.value})} />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label">About</label>
                          <textarea className="form-control" rows="3" name="about" value={company.about} onChange={e => setCompany({...company, about: e.target.value})}></textarea>
                        </div>
                        <div className="col-12"><button className="btn btn-primary" onClick={handleSave}>Save Changes</button></div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
