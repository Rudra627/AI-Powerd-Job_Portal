import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 mt-1" >

      {/* LEFT */}
      <div className="d-flex align-items-center gap-3">
        {/* <button className="btn btn-light" onClick={toggleSidebar}>
          <i className="bi bi-list fs-4"></i>
        </button> */}

        <h4 className="text-primary fw-bold mb-0">JobPortal</h4>
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
      </div>

      {/* RIGHT */}
      <div className="ms-auto d-flex align-items-center gap-4">
          <Link to="/" className="text-dark text-decoration-none text-center">
          <i className="bi bi-house-fill fs-5"></i>
          <div style={{ fontSize: "12px" }}>Home</div>
        </Link>
        <Link to="/messages" className="text-dark text-decoration-none text-center">
          <i className="bi bi-chat-dots-fill fs-5"></i>
          <div style={{ fontSize: "12px" }}>Messaging</div>
        </Link>

        <Link
          to="/notifications"
          className="text-dark text-decoration-none text-center position-relative"
        >
          <i className="bi bi-bell-fill fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            3
          </span>
          <div style={{ fontSize: "12px" }}>Notifications</div>
        </Link>

        {/* USER SECTION (ONLY IF LOGGED IN) */}
        {token && user ? (
          <>
            <Link to="/create-post" className="btn btn-outline-primary btn-sm">
              Create Post
            </Link>

            {/* USER DROPDOWN */}
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle d-flex align-items-center gap-2"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle fs-4"></i>
                <span className="fw-semibold">{user.name}</span>
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/profile">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/">
                    My Posts
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
          
        )}
      </div>
    </nav>
  );
}
