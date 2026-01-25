import { NavLink } from "react-router-dom";
import "./Sidebar.css";
export default function Sidebar() {
  const menu = [
    { path: "/profile", label: "Profile", icon: "bi-person" },
    { path: "/jobs", label: "Jobs", icon: "bi-briefcase" },
    { path: "/create-post", label: "Create Post", icon: "bi-plus-square" },
    { path: "/links", label: "Links", icon: "bi-link-45deg" },
    { path: "/contact", label: "Contact", icon: "bi-telephone" }
  ];

  return (
    <div className="sidebar-fixed bg-white border-end p-3">
      {menu.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `d-flex align-items-center gap-3 px-4 py-3 mb-2 rounded-pill 
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
