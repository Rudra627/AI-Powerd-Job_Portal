import { NavLink } from "react-router-dom";
import "../../components/Sidebar.css";

export default function CompanySidebar() {

  const menu = [
    { path: "/company/", label: "Home", icon: "bi-speedometer2" },
    { path: "/company/profile", label: "Company Profile", icon: "bi-building" },
    { path: "/company/post-job", label: "Post Job", icon: "bi-plus-circle" },
    { path: "/company/company_jobs", label: "My Jobs", icon: "bi-briefcase" },
    {path:"/company/post",label:"Posts",icon:"bi-people"}
  ];

  return (
    <div className="sidebar-fixed bg-white border-end p-3">

      <h5 className="text-primary text-center mb-4">
        Company Panel
      </h5>

      {menu.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/company/"}
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
