import { NavLink } from "react-router-dom";
import "./Sidebar.css"; 

export default function AdminSidebar() {
  const menu = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  ];

  return (
    <div className="sidebar-fixed bg-white border-end shadow-sm flex-column d-flex">
      <div className="p-4 border-bottom text-center mb-2">
        <h5 className="fw-bold text-primary mb-0">Admin Panel</h5>
        <small className="text-muted">Verification Center</small>
      </div>

      {menu.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `d-flex align-items-center gap-3 px-4 py-3 text-decoration-none transition-all ${
              isActive ? "bg-primary text-white shadow-sm" : "text-dark"
            }`
          }
        >
          <i className={`bi ${item.icon} fs-5`}></i>
          <span className="fw-medium">{item.label}</span>
        </NavLink>
      ))}

      <div className="mt-auto p-3">
        <div className="alert alert-info py-2 small mb-0 border-0 shadow-sm">
          <i className="bi bi-info-circle me-2"></i>
          Register approval restricted to admins only.
        </div>
      </div>
    </div>
  );
}
