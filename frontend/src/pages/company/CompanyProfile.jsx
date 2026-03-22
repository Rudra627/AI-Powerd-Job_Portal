import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/Profile.css";
import SpinnerLoader from "../../components/SpinnerLoader";

export default function CompanyProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [company, setCompany] = useState(null);
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
      const res = await api.get("/company/profile");
      setCompany(res.data);
    } catch (err) {
      const errData = err.response?.data || {};
      if (errData.error === "PROFILE_NOT_FOUND") {
        setCompany({});
      } else {
        toast.error(errData.error || "Unable to load company profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.post("/company/profile", company);
      toast.success("Company profile updated");
      setEdit(false);
      fetchCompany();
    } catch (err) {
      const errData = err.response?.data || {};
      toast.error(errData.error || errData.message || "Update failed");
    }
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 2.8 * 1024 * 1024) {
      toast.error("Image size should not exceed 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 500;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const logoStr = canvas.toDataURL("image/webp", 0.8);
        setCompany(prev => ({ ...prev, logo: logoStr }));
        api.post("/company/profile", { ...company, logo: logoStr })
          .then(() => toast.success("Logo updated!"))
          .catch(() => toast.error("Logo update failed"));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="text-center mt-5"><SpinnerLoader size="3rem" color="#0d6efd" /></div>;
  if (!company) return <p className="text-center mt-5">No company profile found</p>;

  return (
    <div className="container mt-4 mb-5">
      <div className="profile-container">
        
        {/* LEFT SIDEBAR */}
        <div className="profile-left-sidebar">
          <img src={company.logo || "https://via.placeholder.com/150"} className="profile-photo" alt="logo" />
          <input type="file" id="logo-upload" hidden accept="image/*" onChange={handleLogo} />
          <label htmlFor="logo-upload" className="btn btn-sm btn-outline-primary mb-3">Change Logo</label>

          <div className="profile-sidebar-section">
            <div className="profile-sidebar-title">Company Info</div>
            <div className="profile-sidebar-item">
              <div className="profile-sidebar-label">Industry</div>
              <div className="profile-sidebar-value text-capitalize">{company.industry_type || "Not set"}</div>
            </div>
            <div className="profile-sidebar-item">
              <div className="profile-sidebar-label">Size</div>
              <div className="profile-sidebar-value">{company.company_size ? `${company.company_size} Employees` : "Not set"}</div>
            </div>
            <div className="profile-sidebar-item">
              <div className="profile-sidebar-label">Type</div>
              <div className="profile-sidebar-value text-capitalize">{company.company_type || "Not set"}</div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="profile-main-content">
          <div className="profile-header-top">
            <div>
              <h1 className="profile-name mb-0">{company.name || "Company Name"}</h1>
              <div className="profile-location mt-1">
                <i className="bi bi-geo-alt"></i> {[company.city, company.state].filter(Boolean).join(", ") || "Location not set"}
              </div>
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer" className="text-primary text-decoration-none fw-semibold mt-1 d-inline-block">
                  <i className="bi bi-globe me-1"></i>{company.website}
                </a>
              )}
            </div>
            <div>
              <button className="btn text-muted"><i className="bi bi-bookmark"></i> Bookmark</button>
            </div>
          </div>

          <div className="profile-btn-group">
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setEdit(true)}>
              <i className="bi bi-pencil"></i> Edit Profile
            </button>
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
                <p className="text-muted" style={{ whiteSpace: "pre-line" }}>{company.about || "No description provided."}</p>
              </section>

              <section className="mb-4">
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Contact Information</h6>
                <div className="info-grid">
                  <div className="info-label">E-mail:</div>
                  <div className="info-value blue">{company.email || "Not provided"}</div>
                  <div className="info-label">Phone:</div>
                  <div className="info-value blue">{company.contact_no || "Not provided"}</div>
                  <div className="info-label">Location:</div>
                  <div className="info-value">{[company.city, company.state].filter(Boolean).join(", ") || "Not provided"}</div>
                  <div className="info-label">Pincode:</div>
                  <div className="info-value">{company.pincode || "Not provided"}</div>
                  <div className="info-label">Website:</div>
                  <div className="info-value blue">{company.website || "Not provided"}</div>
                </div>
              </section>

              <section>
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Business Details</h6>
                <div className="info-grid">
                  <div className="info-label">Company Type:</div>
                  <div className="info-value text-capitalize">{company.company_type || "Not provided"}</div>
                  <div className="info-label">Industry:</div>
                  <div className="info-value text-capitalize">{company.industry_type || "Not provided"}</div>
                  <div className="info-label">Company Size:</div>
                  <div className="info-value">{company.company_size ? `${company.company_size} Employees` : "Not provided"}</div>
                </div>
              </section>
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
                      <h5 className="modal-title fw-bold">Edit Company Information</h5>
                      <button type="button" className="btn-close" onClick={() => setEdit(false)}></button>
                    </div>
                    <div className="modal-body">
                      <div className="row" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">Company Name</label>
                          <input className="form-control" value={company.name || ""} onChange={e => setCompany({...company, name: e.target.value})} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">Email</label>
                          <input type="email" className="form-control" value={company.email || ""} onChange={e => setCompany({...company, email: e.target.value})} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">Contact No</label>
                          <input className="form-control" value={company.contact_no || ""} onChange={e => setCompany({...company, contact_no: e.target.value})} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">Website</label>
                          <input className="form-control" value={company.website || ""} onChange={e => setCompany({...company, website: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Company Type</label>
                          <input className="form-control" placeholder="e.g. Private, Public" value={company.company_type || ""} onChange={e => setCompany({...company, company_type: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Industry Type</label>
                          <input className="form-control" placeholder="e.g. IT, Finance" value={company.industry_type || ""} onChange={e => setCompany({...company, industry_type: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Company Size</label>
                          <input className="form-control" placeholder="e.g. 50, 200" value={company.company_size || ""} onChange={e => setCompany({...company, company_size: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">State</label>
                          <input className="form-control" value={company.state || ""} onChange={e => setCompany({...company, state: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">City</label>
                          <input className="form-control" value={company.city || ""} onChange={e => setCompany({...company, city: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Pincode</label>
                          <input className="form-control" value={company.pincode || ""} onChange={e => setCompany({...company, pincode: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">CIN Number</label>
                          <input className="form-control" value={company.cin_number || ""} onChange={e => setCompany({...company, cin_number: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">GSTIN</label>
                          <input className="form-control" value={company.gstin || ""} onChange={e => setCompany({...company, gstin: e.target.value})} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Udyam Number</label>
                          <input className="form-control" value={company.udyam_number || ""} onChange={e => setCompany({...company, udyam_number: e.target.value})} />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label className="form-label fw-bold">About</label>
                          <textarea className="form-control" rows="3" value={company.about || ""} onChange={e => setCompany({...company, about: e.target.value})}></textarea>
                        </div>
                        <div className="col-12 mt-2">
                          <button className="btn btn-primary px-4 fw-bold" onClick={handleSave}>Save Changes</button>
                          <button className="btn btn-light ms-2 px-4" onClick={() => setEdit(false)}>Cancel</button>
                        </div>
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
