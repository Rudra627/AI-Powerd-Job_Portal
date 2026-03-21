import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import SpinnerLoader from "../components/SpinnerLoader";
import "./JobDetails.css";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Apply Modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeImage, setResumeImage] = useState(null);
  const [whyHireYou, setWhyHireYou] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/seeker/view_job_details/${id}`);
        // The API returns { "res": { job details } } or { "res": "No Job Found" }
        if (response.data && response.data.res) {
          if (response.data.res === "No Job Found") {
            setJob(null);
          } else {
            setJob(response.data.res);
          }
        } else if (response.data && response.data.job) {
          setJob(response.data.job);
        } else if (response.data) {
          setJob(response.data);
        } else {
          toast.error("Failed to load job details.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>;
  if (!job || job.error) return <div className="container mt-5 text-center text-danger"><h4>Job not found</h4></div>;

  const skillsArray = typeof job.skill_need === 'string' && job.skill_need 
    ? job.skill_need.split(',').map(s => s.trim()) 
    : [];

  const handleApplyClick = () => {
    setShowApplyModal(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file only.");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        toast.error("File size must be exactly or below 3MB.");
        return;
      }
      setResumeImage(file);
    }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!resumeImage) {
      toast.error("Please upload your resume image.");
      return;
    }
    if (!whyHireYou.trim()) {
      toast.error("Please answer the question 'Why should I hire you?'.");
      return;
    }

    setApplying(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const payload = {
          job_id: job.id,
          message: whyHireYou,
          resume: reader.result
        };
        const res = await api.post('/seeker/apply_on_job', payload);
        toast.success(res.data?.message || "Application submitted successfully! 🎉");
        setShowApplyModal(false);
        setResumeImage(null);
        setWhyHireYou("");
      } catch (err) {
        const errData = err.response?.data || {};
        toast.error(errData.error || errData.message || errData.msg || "Error applying for job.");
      } finally {
        setApplying(false);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read the file.");
      setApplying(false);
    };
    reader.readAsDataURL(resumeImage);
  };

  return (
    <>
      <div className="container mt-4 mb-5">
        
        <button className="btn btn-light mb-4 shadow-sm" onClick={() => navigate(-1)}>
          &larr; Back
        </button>

        <div className="card border-0 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold text-dark mb-2">{job.title}</h2>
              <h6 className="text-secondary mb-3">{job.full_name ? `Company: ${job.full_name}` : `Company ID: ${job.company_id}`}</h6>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {job.employment_type && <span className="badge bg-primary px-3 py-2 text-capitalize">{job.employment_type?.replace('-', ' ')}</span>}
                {job.is_remote === 'yes' && <span className="badge bg-success px-3 py-2 text-uppercase">Remote</span>}
                {job.status && <span className="badge bg-info text-dark px-3 py-2">Status: <span className="text-capitalize">{job.status}</span></span>}
              </div>
            </div>
            
            <div className="text-start text-md-end">
              <button 
                className="btn btn-primary btn-lg px-5 shadow-sm w-100 d-flex justify-content-center align-items-center gap-2"
                onClick={handleApplyClick}
                style={{ height: "48px" }}
              >
                Apply Now
              </button>
              <div className="text-muted small mt-2 fw-semibold">
                {job.number_of_applications} {job.number_of_applications === 1 ? 'applicant' : 'applicants'}
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
              <div className="text-muted small fw-bold text-uppercase mb-1">Location</div>
              <div className="fs-6">{job.location || 'Not specified'}</div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
              <div className="text-muted small fw-bold text-uppercase mb-1">Experience</div>
              <div className="fs-6">{job.experience_min ? `${job.experience_min} Years Min` : 'Any'}</div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3 mb-md-0">
              <div className="text-muted small fw-bold text-uppercase mb-1">Salary Range</div>
              <div className="fs-6">
                {(job.salary_min || job.salary_max) ? (
                  <>₹{job.salary_min || 0} - ₹{job.salary_max || 'NA'}</>
                ) : 'Not specified'}
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-muted small fw-bold text-uppercase mb-1">Deadline</div>
              <div className="fs-6">{job.close_on ? new Date(job.close_on).toLocaleDateString() : 'Until filled'}</div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="fw-bold text-dark mb-3">About The Role</h5>
            <div className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
              {job.description || "No description provided."}
            </div>
          </div>

          {skillsArray.length > 0 && (
            <div className="mt-5 border-top pt-4">
              <h5 className="fw-bold text-dark mb-3">Skills Required</h5>
              <div className="d-flex flex-wrap gap-2">
                {skillsArray.map((skill, index) => (
                  <span key={index} className="badge bg-light text-dark border px-3 py-2 fw-normal">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.created_at && (
            <div className="text-muted small mt-5 text-end border-top pt-3">
              Posted: {job.created_at}
            </div>
          )}
        </div>

      </div>

      {/* Apply Modal */}
      <div className={`modal fade ${showApplyModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: showApplyModal ? "rgba(0,0,0,0.5)" : "transparent" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-light">
              <h5 className="modal-title fw-bold">Apply for {job.title}</h5>
              <button type="button" className="btn-close" onClick={() => setShowApplyModal(false)}></button>
            </div>
            <form onSubmit={submitApplication}>
              <div className="modal-body p-4">
                
                <div className="mb-4">
                  <label className="form-label fw-bold">Upload Resume (Image only, Max 3MB) <span className="text-danger">*</span></label>
                  <label htmlFor="file" className={`custum-file-upload ${resumeImage ? 'has-file' : ''}`}>
                    <div className="icon">
                      <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier"> 
                          <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path> 
                        </g>
                      </svg>
                    </div>
                    <div className="text">
                      <span>{resumeImage ? resumeImage.name : "Click to upload image"}</span>
                    </div>
                    <input id="file" type="file" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Why should I hire you? <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Briefly explain your relevant skills and experience..."
                    value={whyHireYou}
                    onChange={(e) => setWhyHireYou(e.target.value)}
                    required
                  ></textarea>
                </div>

                <input type="hidden" name="company_id" value={job.company_id} />
                <input type="hidden" name="job_id" value={job.id} />
              </div>
              
              <div className="modal-footer bg-light border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary px-4 d-flex align-items-center gap-2" disabled={applying}>
                  {applying ? (
                    <>
                      <SpinnerLoader size="1.2rem" color="#ffffff" />
                      <span>Submitting...</span>
                    </>
                  ) : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
    </>
  );
}
