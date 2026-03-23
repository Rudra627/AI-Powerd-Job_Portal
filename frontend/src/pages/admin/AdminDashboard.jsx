import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import SpinnerLoader from "../../components/SpinnerLoader";

export default function AdminDashboard() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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
      toast.error("Failed to load companies. Check if /admin prefix is correct.");
    } finally {
      setLoading(false);
    }
  };

  const approveCompany = async (id) => {
    setActionLoading(id);
    try {
      // Assuming a standard naming convention for the approval endpoint
      await api.post(`/admin/approve_company`, { company_id: id });
      toast.success("Company approved successfully! 🎉");
      fetchCompanies();
    } catch (err) {
      const msg = err.response?.data?.error || "Error approving company. Ensure /admin/approve_company exists.";
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
          <h2 className="fw-bold text-dark mb-1">Admin Control Center</h2>
          <p className="text-muted">Manage company registrations and verifications</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={fetchCompanies}>
          <i className="bi bi-arrow-clockwise"></i> Refresh List
        </button>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold"><i className="bi bi-building-check me-2 text-primary"></i> Pending Approvals</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">ID</th>
                      <th>Company Name</th>
                      <th>Email Address</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-muted">
                          <i className="bi bi-inbox fs-2 d-block mb-2 opacity-50"></i>
                          No companies currently awaiting approval.
                        </td>
                      </tr>
                    ) : (
                      companies.map((c) => (
                        <tr key={c.company_id}>
                          <td className="px-4">
                            <span className="text-muted fw-bold">#{c.company_id}</span>
                          </td>
                          <td className="fw-semibold text-dark">{c.name}</td>
                          <td>{c.email}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-success btn-sm px-4 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                              onClick={() => approveCompany(c.company_id)}
                              disabled={actionLoading === c.company_id}
                            >
                              {actionLoading === c.company_id ? (
                                <SpinnerLoader size="1rem" color="#fff" />
                              ) : (
                                <i className="bi bi-check-circle-fill"></i>
                              )}
                              Approve Registration
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="mt-4 text-center">
        <div className="badge bg-light text-secondary border px-3 py-2">
          <i className="bi bi-shield-lock me-2"></i> Authorized Personnel Only
        </div>
      </div>
    </div>
  );
}
