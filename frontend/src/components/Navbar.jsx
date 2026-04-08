import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role") || user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3 px-md-4 h-100">

      {/* LEFT */}
      <div className="d-flex align-items-center gap-2 gap-md-3">
        {/* Hamburger Menu Button - Only show on mobile/tablet */}
        <button
          className="btn btn-light d-lg-none hamburger-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <div className={`hamburger-lines ${sidebarOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <h4 className="text-primary fw-bold mb-0 logo-text">JobPortal</h4>
      </div>

      {/* RIGHT */}
      <div className="ms-auto d-flex align-items-center gap-3 gap-md-4">
        <Link to={role === "company" ? "/company/" : "/"} className="nav-icon-link">
          <i className="bi bi-house-fill fs-5"></i>
          <div className="nav-label">Home</div>
        </Link>

        {role === "company" ? (
          <>
            <Link to="/company/post-job" className="nav-icon-link">
              <i className="bi bi-plus-circle-fill fs-5"></i>
              <div className="nav-label">Post Job</div>
            </Link>
            <Link to="/company/company_jobs" className="nav-icon-link">
              <i className="bi bi-briefcase-fill fs-5"></i>
              <div className="nav-label">My Jobs</div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/messages" className="nav-icon-link">
              <i className="bi bi-chat-dots-fill fs-5"></i>
              <div className="nav-label">Messaging</div>
            </Link>
            <Link to="/notifications" className="nav-icon-link position-relative">
              <i className="bi bi-bell-fill fs-5"></i>
              <div className="nav-label">Notifications</div>
            </Link>
          </>
        )}

        {/* USER SECTION (ONLY IF LOGGED IN) */}
        {token ? (
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center gap-2 px-2 px-md-3"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-person-circle fs-4"></i>
              <span className="fw-semibold d-none d-sm-inline">{user?.name || "Profile"}</span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li className="px-3 py-2 d-sm-none border-bottom mb-2">
                <div className="fw-bold">{user?.name}</div>
                <div className="small text-muted">{user?.email}</div>
              </li>
              <li>
                <Link className="dropdown-item py-2" to={role === "company" ? "/company/profile" : "/profile"}>
                  <i className="bi bi-person-badge me-2"></i>
                  {role === "company" ? "Company Profile" : "My Profile"}
                </Link>
              </li>
              {role === "company" && (
                <li>
                  <Link className="dropdown-item py-2" to="/company/dashboard">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </Link>
                </li>
              )}
              {role === "admin" && (
                <li>
                  <Link className="dropdown-item py-2 fw-bold text-primary" to="/admin/dashboard">
                    <i className="bi bi-shield-lock me-2"></i>
                    Admin Panel
                  </Link>
                </li>
              )}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm px-3">
            Login
          </Link>
        )}
      </div>
    </nav>

  );
}
