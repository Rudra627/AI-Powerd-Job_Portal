import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";
import SpinnerLoader from "../../components/SpinnerLoader";

export default function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeModal, setResumeModal] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysisModal, setAnalysisModal] = useState(null);

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  const loadApplicants = async () => {
    try {
      const res = await api.get(`/company/applications/${jobId}`);
      const data = res.data;
      console.log("applicants response:", data);

      if (Array.isArray(data.res)) {
        setApplicants(data.res);
      } else if (Array.isArray(data)) {
        setApplicants(data);
      } else {
        setApplicants([]);
      }
    } catch (err) {
      console.error("applicants error:", err.response?.data || err.message);
      toast.error(err.response?.data?.err || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = async (applicationId) => {
    try {
      const res = await api.get(`/company/view_resume/${applicationId}`);
      if (res.data.res) {
        setResumeModal(res.data.res);
      } else {
        toast.error("Resume not found for this applicant.");
      }
    } catch (err) {
      console.error("View resume error:", err);
      toast.error(err.response?.data?.error || err.response?.data?.err || "Failed to load resume");
    }
  };

  const handleUpdateStatus = async (applicationId, action) => {
    try {
      let endpoint = '';
      let newStatus = '';
      if (action === "approve") {
        endpoint = `/company/approve_application/${applicationId}`;
        newStatus = "shortlisted";
      } else {
        endpoint = `/company/reject_application/${applicationId}`;
        newStatus = "rejected";
      }

      const res = await api.get(endpoint);
      
      if (res.status === 200 || res.status === 201 || res.data?.msg) {
        toast.success(res.data.msg || `Application marked as ${newStatus}.`);
        setApplicants(prev => prev.map(a => 
          (a.application_id || a.id) === applicationId ? { ...a, application_status: newStatus } : a
        ));
      } else {
        toast.error(res.data?.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Update status error:", err);
      toast.error(err.response?.data?.error || err.response?.data?.msg || "Failed to update status");
    }
  };

  const handleAnalyzeResume = async (applicant) => {
    const appId = applicant.application_id || applicant.id;
    setAnalyzingId(appId);
    try {
      const res = await api.get(`/company/analyze_resume/${appId}`);
      if (res.data.result) {
        setAnalysisModal({
          applicant: applicant,
          result: res.data.result,
          requiredSkill: res.data.required_skill,
          experienceMin: res.data.experience_min
        });
      } else {
        toast.error(res.data.msg || "Analysis failed, no result returned.");
      }
    } catch (err) {
      console.error("Analyze resume error:", err);
      toast.error(err.response?.data?.error || err.response?.data?.msg || "Failed to analyze resume");
    } finally {
      setAnalyzingId(null);
    }
  };

  const renderAnalysisResult = (resultStr) => {
    if (!resultStr) return <span className="text-muted">No analysis available.</span>;
    let textOutput = resultStr;
    try {
      if (typeof resultStr === 'string') {
        let cleaned = resultStr.replace(/```json/gi, '').replace(/```/g, '').trim();
        let parsed = JSON.parse(cleaned);
        
        if (typeof parsed === 'object' && parsed !== null) {
          textOutput = Object.entries(parsed)
            .filter(([_, v]) => v != null && v !== "") // Skip empty details
            .map(([key, value]) => {
              const formattedKey = key.replace(/_/g, ' ').toUpperCase();
              const valStr = Array.isArray(value) ? value.join(", ") : typeof value === 'object' ? JSON.stringify(value) : String(value);
              return `📌 ${formattedKey}:\n${valStr}`;
            }).join("\n\n");
        }
      }
    } catch(e) { 
      // Fallback: If it's already a regular string/paragraph, just strip markdown tags
      textOutput = resultStr.replace(/```json/gi, '').replace(/```/g, '').trim();
    }

    return (
      <div className="text-dark" style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "1.05rem" }}>
        {textOutput}
      </div>
    );
  };

  if (loading) return <div className="text-center mt-5"><SpinnerLoader size="3rem" color="#0d6efd" /></div>;

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left me-1"></i> Back to My Jobs
      </button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Applicants for Job #{jobId}</h4>
        <span className="badge bg-primary fs-6">{applicants.length} Applicants</span>
      </div>

      {applicants.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
          <p>No applications received yet for this job.</p>
        </div>
      )}

      {applicants.map((a, idx) => (
        <div key={a.application_id || idx} className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-person-circle fs-4 text-primary"></i>
                  <h5 className="fw-bold text-dark mb-0">{a.name || `Applicant #${idx + 1}`}</h5>
                  {a.application_status && (
                    <span className={`badge ms-2 ${
                      (a.application_status === 'approved' || a.application_status === 'shortlisted') ? 'bg-success' : 
                      a.application_status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'
                    }`}>
                      {a.application_status.toUpperCase()}
                    </span>
                  )}
                </div>

                {a.email && (
                  <div className="text-muted small ms-4">
                    <i className="bi bi-envelope me-1"></i>{a.email}
                  </div>
                )}

                {a.message && (
                  <div className="mt-2 ms-4 p-3 bg-light rounded">
                    <div className="fw-semibold text-primary small mb-1">Why should you hire me:</div>
                    <div className="text-dark">{a.message}</div>
                  </div>
                )}

                {a.applied_at && (
                  <div className="text-muted small mt-2 ms-4">
                    <i className="bi bi-calendar-check me-1"></i>
                    Applied: {new Date(a.applied_at).toLocaleDateString()} at {new Date(a.applied_at).toLocaleTimeString()}
                  </div>
                )}
              </div>

              <div className="d-flex flex-column gap-2">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleViewResume(a.application_id || a.id)}>
                  <i className="bi bi-file-earmark-image me-1"></i> View Resume
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleAnalyzeResume(a)}
                  disabled={analyzingId === (a.application_id || a.id)}
                >
                  {analyzingId === (a.application_id || a.id) ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                       <SpinnerLoader size="1rem" color="#ffffff" />
                       <span>Analyzing...</span>
                    </div>
                  ) : (
                    <><i className="bi bi-robot me-1"></i> Analyse Resume</>
                  )}
                </button>
                <hr className="my-1 border-secondary opacity-25" />
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success btn-sm flex-fill" 
                    onClick={() => handleUpdateStatus(a.application_id || a.id, "approve")}
                    disabled={a.application_status === "approved" || a.application_status === "shortlisted"}
                  >
                    <i className="bi bi-check-circle me-1"></i>Approve
                  </button>
                  <button 
                    className="btn btn-danger btn-sm flex-fill" 
                    onClick={() => handleUpdateStatus(a.application_id || a.id, "reject")}
                    disabled={a.application_status === "rejected"}
                  >
                    <i className="bi bi-x-circle me-1"></i>Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Resume Modal */}
      {resumeModal && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.6)", zIndex: 1050 }} onClick={() => setResumeModal(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Resume Preview</h5>
                <button type="button" className="btn-close" onClick={() => setResumeModal(null)}></button>
              </div>
              <div className="modal-body text-center p-4">
                <img src={resumeModal} alt="Resume" className="img-fluid rounded shadow-sm" style={{ maxHeight: "75vh" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {analysisModal && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.6)", zIndex: 1050 }} onClick={() => setAnalysisModal(null)}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-robot me-2"></i>AI Resume Analysis
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setAnalysisModal(null)}></button>
              </div>
              <div className="modal-body p-4 bg-light">
                {/* 1. Comparison Section */}
                <div className="row g-4 mb-4">
                  {/* Job Requirements */}
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 border-start border-4 border-warning">
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-3 text-warning-emphasis d-flex align-items-center">
                          <i className="bi bi-briefcase me-2"></i>Job Requirements
                        </h5>
                        <ul className="list-group list-group-flush bg-transparent">
                          <li className="list-group-item bg-transparent px-0 border-0">
                            <strong><i className="bi bi-code-square me-2"></i>Required Skills:</strong>
                            <div className="mt-2 d-flex flex-wrap gap-1">
                              {analysisModal.requiredSkill ? analysisModal.requiredSkill.split(',').map((skill, i) => (
                                <span key={i} className="badge bg-light text-dark border">{skill.trim()}</span>
                              )) : <span className="text-muted">Not specified</span>}
                            </div>
                          </li>
                          <li className="list-group-item bg-transparent px-0 border-0">
                            <strong><i className="bi bi-clock-history me-2"></i>Min Experience:</strong>
                            <div className="mt-1 text-primary-emphasis fw-semibold">
                              {analysisModal.experienceMin || '0'} Years
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Profiling */}
                  <div className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 border-start border-4 border-success">
                      <div className="card-body p-4">
                        <h5 className="fw-bold mb-3 text-success d-flex align-items-center">
                          <i className="bi bi-person-check me-2"></i>Applicant Condition
                        </h5>
                        <ul className="list-group list-group-flush bg-transparent">
                          <li className="list-group-item bg-transparent px-0 border-0">
                            <strong><i className="bi bi-mortarboard me-2"></i>Analysis Profile:</strong>
                            <div className="mt-2">
                               <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                                 {analysisModal.applicant.name || 'Applicant'}
                               </span>
                            </div>
                          </li>
                          <li className="list-group-item bg-transparent px-0 border-0">
                             <strong>Match Summary:</strong>
                             <div className="mt-2 fw-medium text-dark small">
                                {analysisModal.result && analysisModal.result.toLowerCase().includes('recommend') 
                                  ? '✅ System recommends this applicant based on criteria.' 
                                  : '⚠️ Review analysis insights for fitment details.'}
                             </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. AI Analysis Insights (The full text) */}
                <div className="card shadow-sm border-0 border-start border-4 border-primary">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4 pb-2 text-primary border-bottom">
                      <i className="bi bi-stars me-2"></i>Full Analysis Details
                    </h5>
                    {renderAnalysisResult(analysisModal.result)}
                  </div>
                </div>

              </div>
              <div className="modal-footer bg-white border-top-0">
                <button className="btn btn-secondary px-4 fw-semibold" onClick={() => setAnalysisModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
