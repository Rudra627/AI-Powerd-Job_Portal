import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import SpinnerLoader from "../../components/SpinnerLoader";

export default function Applicants() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeModal, setResumeModal] = useState(null);

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      const res = await api.get("/company/applicants");
      const data = res.data;

      if (data.res && Array.isArray(data.res)) {
        setApps(data.res);
      } else if (data.applicants && Array.isArray(data.applicants)) {
        setApps(data.applicants);
      } else {
        setApps([]);
      }
    } catch {
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><SpinnerLoader size="3rem" color="#0d6efd" /></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Applicants</h4>
        <span className="badge bg-primary fs-6">{apps.length} Total</span>
      </div>

      {apps.length === 0 && (
        <div className="text-center text-muted py-5">
          <i className="bi bi-people fs-1 d-block mb-2"></i>
          <p>No applicants yet.</p>
        </div>
      )}

      {apps.map((a, idx) => (
        <div key={a.id || idx} className="card border-0 shadow-sm mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <h6 className="fw-bold text-dark mb-1">{a.name || a.full_name || `Applicant #${a.job_seeker_id || idx + 1}`}</h6>
                {a.job_title && <div className="text-muted small mb-1">Applied for: <span className="fw-semibold text-dark">{a.job_title}</span></div>}
                {a.message && (
                  <div className="mt-2 p-2 bg-light rounded small">
                    <strong className="text-primary">Why hire me:</strong> {a.message}
                  </div>
                )}
                {a.applied_at && (
                  <div className="text-muted small mt-2">
                    <i className="bi bi-calendar me-1"></i> Applied: {new Date(a.applied_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="d-flex flex-column gap-2">
                {a.resume && (
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setResumeModal(a.resume)}>
                    <i className="bi bi-file-earmark-image me-1"></i> View Resume
                  </button>
                )}
                <button className="btn btn-primary btn-sm">
                  <i className="bi bi-robot me-1"></i> AI Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Resume View Modal */}
      {resumeModal && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setResumeModal(null)}>
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
    </div>
  );
}
