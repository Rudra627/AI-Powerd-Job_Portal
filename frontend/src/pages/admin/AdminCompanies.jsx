import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import SpinnerLoader from "../../components/SpinnerLoader";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");


  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/admin/view_applied_company");
      // res.data.res = list of companies or "no company avilable"
      if (res.data && Array.isArray(res.data.res)) {
        setCompanies(res.data.res);
      } else {
        setCompanies([]);
      }
    } catch (err) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const verifyCompany = async (id, status) => {
    setActionLoading(id);
    try {
      if (status === "verified") {
        await api.get(`/admin/aprove_company/${id}`);
        toast.success("Company approved successfully!");
      } else {
        await api.post(`/admin/reject_company/${id}`, {
          post_id: id,
          reason: rejectReason || "Application has been rejected by admin."
        });
        toast.success("Company rejected successfully.");
        setRejectModal(null);
        setRejectReason("");
      }
      fetchCompanies();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.msg || `Failed to ${status} company`;
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <SpinnerLoader size="3rem" color="#0d6efd" />
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark">Company Verification</h3>
          <p className="text-muted">Review and approve new company registrations</p>
        </div>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchCompanies}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="py-3">Company Name</th>
                <th className="py-3">Email</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    <i className="bi bi-building-dash fs-1 d-block mb-3 opacity-25"></i>
                    No pending company applications found.
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c.company_id}>
                    <td className="px-4">
                      <span className="badge bg-light text-dark border">#{c.company_id}</span>
                    </td>
                    <td>
                      <div className="fw-bold">{c.name}</div>
                    </td>
                    <td>{c.email}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-success btn-sm px-3 d-flex align-items-center gap-1"
                          onClick={() => verifyCompany(c.company_id, "verified")}
                          disabled={actionLoading === c.company_id}
                        >
                          {actionLoading === c.company_id ? (
                            <SpinnerLoader size="1rem" color="#fff" />
                          ) : (
                            <i className="bi bi-check-circle"></i>
                          )}
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm px-3 d-flex align-items-center gap-1"
                          onClick={() => setRejectModal(c.company_id)}
                          disabled={actionLoading === c.company_id}
                        >
                          <i className="bi bi-x-circle"></i> Reject
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectModal && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setRejectModal(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Company</h5>
                <button type="button" className="btn-close" onClick={() => setRejectModal(null)}></button>
              </div>
              <div className="modal-body">
                <p>Provide a reason for rejecting this company application:</p>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter rejection reason..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRejectModal(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => verifyCompany(rejectModal, "rejected")}
                  disabled={actionLoading === rejectModal}
                >
                  {actionLoading === rejectModal ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
