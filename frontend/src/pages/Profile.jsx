import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API = "https://dt20tzx0-5000.inc1.devtunnels.ms";

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };

  const [profile, setProfile] = useState(null);
  const [academic, setAcademic] = useState(null); // ✅ SINGLE ACADEMIC
  const [skills, setSkills] = useState([]);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROFILE ================= */

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
      setAcademic(data.academics?.[0] || null); // ✅ important
      setSkills(data.skills || []);
    } catch {
      toast.error("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const formatDate = (v) => (v ? v.split("T")[0] : "");

  /* ================= PERSONAL ================= */

  const savePersonal = async () => {
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

    await save("/seeker/per_info", payload, "Personal info updated");
  };

  /* ================= PROFESSIONAL ================= */

  const saveProfessional = async () => {
    const payload = {
      employment_status: profile.employment_status || "unemployed",
      current_role: profile.current_role || "",
      experience_years: Number(profile.experience_years || 0),
      preferred_location: profile.preferred_location || "",
      open_for: profile.open_for || "None"
    };

    await save("/seeker/prof_info", payload, "Professional info updated");
  };

  /* ================= ACADEMIC (ONE ONLY) ================= */

const addAcademic = () => {
  if (academic) {
    toast.info("Academic already added");
    return;
  }

  setAcademic({
    level: "Bachelor",
    institution_name: "",
    start_year: "",
    end_year: "",
    is_current: "no",
    current_year: null
  });

  setEdit("academic"); // 🔥 MUST BE HERE
};


  const updateAcademic = (key, value) => {
    setAcademic(prev => ({ ...prev, [key]: value }));
  };

  const saveAcademic = async () => {
    if (!academic) {
      toast.error("Add academic details first");
      return;
    }

    await save("/seeker/acd_info", academic, "Academic added successfully");
  };

  /* ================= SKILLS ================= */

  const updateSkill = (i, key, value) => {
    const copy = [...skills];
    copy[i][key] = value;
    setSkills(copy);
  };

  const addSkill = () => {
    setSkills([...skills, { skill: "", proficiency: "beginner" }]);
  };

  const removeSkill = (i) => {
    setSkills(skills.filter((_, idx) => idx !== i));
  };

  const saveSkills = async () => {
    await save("/seeker/skill_info", skills, "Skills updated");
  };

  /* ================= IMAGE ================= */

  const changePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(p => ({ ...p, photo: reader.result }));
      toast.info("Click Save in Personal section");
    };
    reader.readAsDataURL(file);
  };

  /* ================= COMMON SAVE ================= */

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

  /* ================= UI ================= */

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!profile) return <p className="text-center mt-5">No profile found</p>;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">

        <h4>My Profile</h4>

        {/* PHOTO */}
        <div className="text-center mb-3">
          <img
            src={profile.photo}
            width="120"
            height="120"
            className="rounded-circle border"
            alt="profile"
          />
          <div className="mt-2">
            <label className="btn btn-sm btn-outline-primary">
              Change Photo
              <input type="file" hidden onChange={changePhoto} />
            </label>
          </div>
        </div>

        {/* PERSONAL */}
        <Header title="Personal" id="personal" edit={edit} setEdit={setEdit} onSave={savePersonal} />
        {input("Name", "name")}
        {input("Date of Birth", "date_of_birth", "date")}
        {select("Gender", "gender", ["male","female","other"])}
        {input("Country", "country")}
        {input("State", "state")}
        {input("City", "city")}
        {input("Pincode", "pincode")}
        {textarea("About", "about")}

        {/* PROFESSIONAL */}
        <Header title="Professional" id="professional" edit={edit} setEdit={setEdit} onSave={saveProfessional} />
        {select("Employment Status", "employment_status", ["unemployed","employed","fresher"])}
        {input("Current Role", "current_role")}
        {input("Experience Years", "experience_years", "number")}
        {input("Preferred Location", "preferred_location")}
        {select("Open For", "open_for", ["job","internship","None"])}

        {/* ACADEMIC */}
        <Header title="Academics" id="academic" edit={edit} setEdit={setEdit} onSave={saveAcademic} />

        {edit === "academic" ? (
          <div className="border p-3 mb-2">
            <select
              className="form-control mb-2"
              value={academic?.level || "Bachelor"}
              onChange={e => updateAcademic("level", e.target.value)}
            >
              {["10th","12th","Diploma","Bachelor","Master","Doctorate"].map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>

            <input
              className="form-control mb-2"
              placeholder="Institution Name"
              value={academic?.institution_name || ""}
              onChange={e => updateAcademic("institution_name", e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="Start Year"
              value={academic?.start_year || ""}
              onChange={e => updateAcademic("start_year", e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="End Year"
              value={academic?.end_year || ""}
              onChange={e => updateAcademic("end_year", e.target.value)}
            />
          </div>
        ) : academic ? (
          <div className="border p-3 mb-2">
            <p className="fw-semibold">
              {academic.level} — {academic.institution_name}
            </p>
            <small>
              {academic.start_year} – {academic.end_year || "Present"}
            </small>
            <div className="text-muted" style={{ fontSize: 12 }}>
              Academic details locked
            </div>
          </div>
        ) : (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={addAcademic}
          >
            + Add Academic
          </button>
        )}

        {/* SKILLS */}
        <Header title="Skills" id="skills" edit={edit} setEdit={setEdit} onSave={saveSkills} />
        {skills.map((s,i)=>(
          <div key={i} className="d-flex gap-2 mb-2">
            {edit==="skills" ? (
              <>
                <input
                  className="form-control"
                  value={s.skill}
                  onChange={e=>updateSkill(i,"skill",e.target.value)}
                />
                <select
                  className="form-control"
                  value={s.proficiency}
                  onChange={e=>updateSkill(i,"proficiency",e.target.value)}
                >
                  {["beginner","intermediate","expert"].map(p=><option key={p}>{p}</option>)}
                </select>
                <button className="btn btn-danger btn-sm" onClick={()=>removeSkill(i)}>X</button>
              </>
            ):(
              <span className="badge bg-secondary">
                {s.skill} ({s.proficiency})
              </span>
            )}
          </div>
        ))}
        {edit==="skills" && (
          <button className="btn btn-sm btn-outline-primary" onClick={addSkill}>
            + Add Skill
          </button>
        )}

      </div>
    </div>
  );

  function input(label,key,type="text"){
    const editing = edit==="personal" || edit==="professional";
    return (
      <div className="mb-2">
        <label>{label}</label>
        {editing
          ? <input type={type} className="form-control"
              value={profile[key]||""}
              onChange={e=>setProfile({...profile,[key]:e.target.value})}/>
          : <p>{profile[key]||"Not added"}</p>}
      </div>
    );
  }

  function textarea(label,key){
    const editing = edit==="personal";
    return (
      <div className="mb-2">
        <label>{label}</label>
        {editing
          ? <textarea className="form-control"
              value={profile[key]||""}
              onChange={e=>setProfile({...profile,[key]:e.target.value})}/>
          : <p>{profile[key]||"Not added"}</p>}
      </div>
    );
  }

  function select(label,key,options){
    const editing = edit==="personal" || edit==="professional";
    return (
      <div className="mb-2">
        <label>{label}</label>
        {editing ? (
          <select
            className="form-control"
            value={profile[key]||options[0]}
            onChange={e=>setProfile({...profile,[key]:e.target.value})}
          >
            {options.map(o=><option key={o}>{o}</option>)}
          </select>
        ) : (
          <p>{profile[key]||"Not added"}</p>
        )}
      </div>
    );
  }
}

function Header({title,id,edit,setEdit,onSave}){
  return (
    <div className="d-flex justify-content-between align-items-center mt-4">
      <h5>{title}</h5>
      {edit===id
        ? <button className="btn btn-success btn-sm" onClick={onSave}>Save</button>
        : <button className="btn btn-outline-primary btn-sm" onClick={()=>setEdit(id)}>Edit</button>}
    </div>
  );
}
