import { NavLink } from "react-router-dom";

export default function CompanySidebar() {

  const menu = [
    { path: "/company/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/company/profile", label: "Company Profile", icon: "bi-building" },
    { path: "/company/post-job", label: "Post Job", icon: "bi-plus-circle" },
    { path: "/company/jobs", label: "My Jobs", icon: "bi-briefcase" },
    { path: "/company/applicants", label: "Applicants", icon: "bi-people" }
  ];

  return (
    <div
      className="company-sidebar bg-white border-end vh-100 p-3"
      style={{
        width: "250px",
        position: "fixed",
        top: "70px",        // adjust if you have navbar
        left: 0
      }}
    >

      <h5 className="text-primary text-center mb-4">
        Company Panel
      </h5>

      {menu.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `d-flex align-items-center gap-3 px-4 py-2 mb-2 rounded-pill
            ${isActive ? "bg-primary text-white" : "text-dark"}`
          }
          style={{ textDecoration: "none" }}
        >
          <i className={`bi ${item.icon} fs-5`}></i>
          <span className="fw-semibold">{item.label}</span>
        </NavLink>
      ))}

    </div>
  );
}
