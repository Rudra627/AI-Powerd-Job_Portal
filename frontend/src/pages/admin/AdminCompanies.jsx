import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import SpinnerLoader from "../../components/SpinnerLoader";

export default function AdminCompanies() {
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
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const verifyCompany = async (id, status) => {
    setActionLoading(id);
    try {
      // Assuming these endpoints exist or will be created
      const res = await api.post(`/admin/verify_company`, {
        company_id: id,
        status: status // 'verified' or 'rejected'
      });
      toast.success(`Company ${status} successfully!`);
      fetchCompanies(); // Refresh list
    } catch (err) {
      const msg = err.response?.data?.error || `Failed to ${status} company`;
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
                          onClick={() => verifyCompany(c.company_id, "rejected")}
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
    </div>
  );
}
