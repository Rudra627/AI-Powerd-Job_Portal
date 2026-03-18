import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };

  const [profile, setProfile] = useState(null);
  const [academic, setAcademic] = useState(null);
  const [skills, setSkills] = useState([]);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (!token) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/seeker/profile`, { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data.profile);
      setAcademic(data.academics?.[0] || null);
      setSkills(data.skills || []);
    } catch {
      toast.error("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (v) => (v ? v.split("T")[0] : "");

  const save = async (endpoint, body, msg) => {
    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || data.message || "Update failed");
        return;
      }
      toast.success(msg);
      setEdit(null);
      fetchProfile();
    } catch {
      toast.error("Server error");
    }
  };

  const savePersonal = () => {
    const payload = {
      name: profile.name || "",
      dob: formatDate(profile.date_of_birth),
      gender: profile.gender || "other",
      country: profile.country || "",
      state: profile.state || "",
      city: profile.city || "",
      pincode: profile.pincode || "",
      about: profile.about || "",
      photo: profile.photo || ""
    };
    save("/seeker/per_info", payload, "Personal info updated");
  };

  const changePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile(p => ({ ...p, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!profile) return <p className="text-center mt-5">No profile found</p>;

  return (
    <div className="container mt-4 mb-5">
      <div className="profile-container">
        
        {/* LEFT SIDEBAR */}
        <div className="profile-left-sidebar">
          <img src={profile.photo || "https://via.placeholder.com/150"} className="profile-photo" alt="avatar" />
          <input type="file" id="photo-upload" hidden onChange={changePhoto} />
          <label htmlFor="photo-upload" className="btn btn-sm btn-outline-primary mb-3">Change Photo</label>

          <div className="profile-sidebar-section">
            <div className="profile-sidebar-title">Work</div>
            <div className="profile-sidebar-item">
              <div className="profile-sidebar-label">{profile.current_role || "Role not set"}</div>
              <div className="profile-sidebar-value text-capitalize">{profile.employment_status || "Unknown"}</div>
            </div>
            {academic && (
              <div className="profile-sidebar-item">
                <div className="profile-sidebar-label">{academic.institution_name}</div>
                <div className="experience-meta">{academic.level}</div>
              </div>
            )}
          </div>

          <div className="profile-sidebar-section">
            <div className="profile-sidebar-title">Skills</div>
            <div className="d-flex flex-wrap">
              {skills.map((s, i) => (
                <span key={i} className="skill-tag">{s.skill}</span>
              ))}
              {skills.length === 0 && <small className="text-muted">No skills added</small>}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="profile-main-content">
          <div className="profile-header-top">
            <div>
              <h1 className="profile-name">{profile.name}</h1>
              <div className="profile-location">
                <i className="bi bi-geo-alt"></i> {profile.city}, {profile.country}
              </div>
              <div className="text-primary fw-semibold mt-1">{profile.current_role}</div>

              <div className="profile-rankings">
                <div className="profile-rank-label">Rankings</div>
                <div className="d-flex align-items-center gap-2">
                  <span className="profile-rank-value">8,6</span>
                  <div className="text-primary">
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star-fill"></i>
                    <i className="bi bi-star"></i>
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
              <i className="bi bi-chat-left-text"></i> Send message
            </button>
            <button className="btn btn-primary d-flex align-items-center gap-2">
              <i className="bi bi-check2-circle"></i> Contacts
            </button>
            <button className="btn text-muted">Report user</button>
          </div>

          {/* TABS */}
          <div className="profile-tabs mt-4">
            <div 
              className={`profile-tab ${activeTab === "timeline" ? "active" : ""}`}
              onClick={() => setActiveTab("timeline")}
            >
              <i className="bi bi-eye"></i> Timeline
            </div>
            <div 
              className={`profile-tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <i className="bi bi-person"></i> About
            </div>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "about" ? (
            <div className="tab-content">
              <section className="mb-4">
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Contact Information</h6>
                <div className="info-grid">
                  <div className="info-label">Phone:</div>
                  <div className="info-value blue">+1 123 456 7890</div>
                  <div className="info-label">Address:</div>
                  <div className="info-value">{profile.city}, {profile.state}, {profile.country}</div>
                  <div className="info-label">E-mail:</div>
                  <div className="info-value blue">{profile.email || "user@example.com"}</div>
                  <div className="info-label">Site:</div>
                  <div className="info-value blue">www.portfolio.com</div>
                </div>
              </section>

              <section>
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Basic Information</h6>
                <div className="info-grid">
                  <div className="info-label">Birthday:</div>
                  <div className="info-value">{formatDate(profile.date_of_birth)}</div>
                  <div className="info-label">Gender:</div>
                  <div className="info-value text-capitalize">{profile.gender}</div>
                </div>
              </section>

              <div className="mt-5 pt-3 border-top">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setEdit("personal")}>Edit Profile Data</button>
              </div>
            </div>
          ) : (
            <div className="tab-content">
              <section>
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Work Experience</h6>
                <div className="experience-card">
                  <div className="d-flex justify-content-between">
                    <div className="experience-title">{profile.current_role || "Searching for role"}</div>
                    <span className="badge bg-primary-subtle text-primary">Primary</span>
                  </div>
                  <div className="experience-meta">{profile.experience_years} Years Experience</div>
                  <p className="text-muted small mt-2">{profile.about || "No additional information provided."}</p>
                </div>

                {academic && (
                  <section className="mt-4">
                    <h6 className="text-muted text-uppercase small fw-bold mb-3">Education</h6>
                    <div className="experience-card">
                      <div className="experience-title">{academic.institution_name}</div>
                      <div className="experience-meta">{academic.level} | {academic.start_year} - {academic.end_year || "Present"}</div>
                    </div>
                  </section>
                )}
              </section>
            </div>
          )}

          {/* EDIT MODAL */}
          {edit && (
             <div className="modal show d-block" style={{background: "rgba(0,0,0,0.5)"}}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title text-capitalize">Edit {edit} Information</h5>
                      <button type="button" className="btn-close" onClick={() => setEdit(null)}></button>
                    </div>
                    <div className="modal-body">
                      {edit === "personal" && (
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Name</label>
                            <input className="form-control" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">DOB</label>
                            <input type="date" className="form-control" value={formatDate(profile.date_of_birth)} onChange={e => setProfile({...profile, date_of_birth: e.target.value})} />
                          </div>
                          <div className="col-md-12 mb-3">
                            <label className="form-label">About</label>
                            <textarea className="form-control" rows="3" value={profile.about} onChange={e => setProfile({...profile, about: e.target.value})}></textarea>
                          </div>
                          <div className="col-12"><button className="btn btn-primary" onClick={savePersonal}>Save Changes</button></div>
                        </div>
                      )}
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
