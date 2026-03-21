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

  const getPersonalPayload = (overrides = {}) => ({
    name: profile.name || "",
    dob: formatDate(profile.date_of_birth),
    gender: profile.gender || "other",
    phone: profile.phone || "",
    country: profile.country || "",
    state: profile.state || "",
    city: profile.city || "",
    pincode: profile.pincode || "",
    about: profile.about || "",
    photo: profile.photo || "",
    visibility: profile.visibility || "public",
    employment_status: profile.employment_status || "",
    current_role: profile.current_role || "",
    experience_years: profile.experience_years || "",
    preferred_location: profile.preferred_location || "",
    open_for: profile.open_for || "",
    ...overrides
  });

  const savePersonal = () => {
    save("/seeker/per_info", getPersonalPayload(), "Personal info updated");
  };

  const changePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const photoStr = reader.result;
      setProfile(p => ({ ...p, photo: photoStr }));
      // Instantly upload the modified photo
      save("/seeker/per_info", getPersonalPayload({ photo: photoStr }), "Profile photo updated successfully!");
    };
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
            <div className="d-flex flex-wrap gap-1">
              {skills.map((s, i) => (
                <span key={i} className="skill-tag text-capitalize">
                  {typeof s === 'object' ? `${s.skill}${s.proficiency ? ` (${s.proficiency})` : ''}` : s}
                </span>
              ))}
              {skills.length === 0 && <small className="text-muted">No skills added</small>}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="profile-main-content">
          <div className="profile-header-top">
            <div>
              <div className="d-flex align-items-center gap-2">
                <h1 className="profile-name mb-0">{profile.name}</h1>
                {profile.visibility && (
                  <span className={`badge ${profile.visibility === 'public' ? 'bg-success' : 'bg-secondary'} text-capitalize`}>
                    {profile.visibility}
                  </span>
                )}
              </div>
              <div className="profile-location mt-1">
                <i className="bi bi-geo-alt"></i> {[profile.city, profile.state, profile.country].filter(Boolean).join(", ") || "Location not set"}
              </div>
              <div className="text-primary fw-semibold mt-1">{profile.current_role}</div>

            
            </div>
            <div>
              <button className="btn text-muted"><i className="bi bi-bookmark"></i> Bookmark</button>
            </div>
          </div>

          <div className="profile-btn-group">
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setEdit("personal")}>
              <i className="bi bi-pencil"></i> Edit Profile
            </button>
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
                  <div className="info-label">E-mail:</div>
                  <div className="info-value blue">{profile.email || "Not provided"}</div>
                  <div className="info-label">Phone:</div>
                  <div className="info-value blue">{profile.phone || "Not provided"}</div>
                  <div className="info-label">Location:</div>
                  <div className="info-value">{[profile.city, profile.state, profile.country].filter(Boolean).join(", ") || "Not provided"}</div>
                  <div className="info-label">Pincode:</div>
                  <div className="info-value">{profile.pincode || "Not provided"}</div>
                </div>
              </section>

              <section>
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Basic Information</h6>
                <div className="info-grid">
                  <div className="info-label">Birthday:</div>
                  <div className="info-value">{formatDate(profile.date_of_birth) || "Not provided"}</div>
                  <div className="info-label">Gender:</div>
                  <div className="info-value text-capitalize">{profile.gender || "Not provided"}</div>
                  <div className="info-label">Visibility:</div>
                  <div className="info-value text-capitalize">{profile.visibility || "Not provided"}</div>
                </div>
              </section>

            </div>
          ) : (
            <div className="tab-content">
              <section>
                <h6 className="text-muted text-uppercase small fw-bold mb-3">Work Experience</h6>
                <div className="experience-card mb-4">
                  <div className="d-flex justify-content-between">
                    <div className="experience-title">{profile.current_role || "Searching for role"}</div>
                    <span className="badge bg-primary-subtle text-primary">Primary</span>
                  </div>
                  <div className="experience-meta">{profile.experience_years ? `${profile.experience_years} Years Experience` : "Experience not specified"}</div>
                  <p className="text-muted small mt-2" style={{ whiteSpace: "pre-line" }}>{profile.about || "No additional information provided."}</p>
                </div>

                {(profile.preferred_location || profile.open_for) && (
                  <section className="mb-4">
                    <h6 className="text-muted text-uppercase small fw-bold mb-3">Preferences</h6>
                    <div className="info-grid">
                      {profile.preferred_location && (
                        <>
                          <div className="info-label">Locations:</div>
                          <div className="info-value text-capitalize">{profile.preferred_location}</div>
                        </>
                      )}
                      {profile.open_for && (
                        <>
                          <div className="info-label">Open For:</div>
                          <div className="info-value text-capitalize">{profile.open_for.replace(/,/g, ', ')}</div>
                        </>
                      )}
                    </div>
                  </section>
                )}

                {academic && (
                  <section className="mt-4">
                    <h6 className="text-muted text-uppercase small fw-bold mb-3">Education</h6>
                    <div className="experience-card">
                      <div className="experience-title">{academic.institution_name}</div>
                      <div className="experience-meta">
                        {academic.level} | {academic.start_year} - {academic.is_current ? (academic.current_year ? `Present (${academic.current_year} Year)` : "Present") : (academic.end_year || "Unknown")}
                      </div>
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
                        <div className="row" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Name</label>
                            <input className="form-control" value={profile.name || ""} onChange={e => setProfile({...profile, name: e.target.value})} />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">DOB</label>
                            <input type="date" className="form-control" value={formatDate(profile.date_of_birth)} onChange={e => setProfile({...profile, date_of_birth: e.target.value})} />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Gender</label>
                            <select className="form-select text-capitalize" value={profile.gender || "other"} onChange={e => setProfile({...profile, gender: e.target.value})}>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Phone</label>
                            <input className="form-control" value={profile.phone || ""} onChange={e => setProfile({...profile, phone: e.target.value})} />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Visibility</label>
                            <select className="form-select text-capitalize" value={profile.visibility || "public"} onChange={e => setProfile({...profile, visibility: e.target.value})}>
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Country</label>
                            <input className="form-control" value={profile.country || ""} onChange={e => setProfile({...profile, country: e.target.value})} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">State</label>
                            <input className="form-control" value={profile.state || ""} onChange={e => setProfile({...profile, state: e.target.value})} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">City</label>
                            <input className="form-control" value={profile.city || ""} onChange={e => setProfile({...profile, city: e.target.value})} />
                          </div>
                          <div className="col-md-3 mb-3">
                            <label className="form-label fw-bold">Pincode</label>
                            <input className="form-control" value={profile.pincode || ""} onChange={e => setProfile({...profile, pincode: e.target.value})} />
                          </div>

                          {/* Professional Info Group */}
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Current Role</label>
                            <input className="form-control" value={profile.current_role || ""} onChange={e => setProfile({...profile, current_role: e.target.value})} />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Employment Status</label>
                            <input className="form-control" value={profile.employment_status || ""} onChange={e => setProfile({...profile, employment_status: e.target.value})} />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Years Experience</label>
                            <input type="number" step="0.5" className="form-control" value={profile.experience_years || ""} onChange={e => setProfile({...profile, experience_years: e.target.value})} />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Preferred Locations</label>
                            <input className="form-control" placeholder="e.g. Remote, Bangalore" value={profile.preferred_location || ""} onChange={e => setProfile({...profile, preferred_location: e.target.value})} />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Open For</label>
                            <input className="form-control" placeholder="e.g. Full-time, Contract" value={profile.open_for || ""} onChange={e => setProfile({...profile, open_for: e.target.value})} />
                          </div>

                          <div className="col-md-12 mb-3">
                            <label className="form-label fw-bold">About</label>
                            <textarea className="form-control" rows="3" value={profile.about || ""} onChange={e => setProfile({...profile, about: e.target.value})}></textarea>
                          </div>
                          <div className="col-12 mt-2">
                            <button className="btn btn-primary px-4 fw-bold" onClick={savePersonal}>Save Changes</button>
                            <button className="btn btn-light ms-2 px-4" onClick={() => setEdit(null)}>Cancel</button>
                          </div>
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
