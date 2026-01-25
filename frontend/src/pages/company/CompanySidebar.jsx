import { NavLink } from "react-router-dom";

export default function CompanySidebar() {
  const menu = [
    { path: "/company/dashboard", label: "Dashboard" },
    { path: "/company/profile", label: "Company Profile" },
    { path: "/company/post-job", label: "Post a Job" },
    { path: "/company/jobs", label: "My Jobs" },
    { path: "/company/applicants", label: "Applicants" }
  ];

  return (
    <div className="p-3 vh-100 border-end bg-white">
      <h5 className="mb-4">Company Panel</h5>

      {menu.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={false}
          className={({ isActive }) =>
            `d-block px-3 py-2 mb-2 rounded ${
              isActive ? "bg-primary text-white" : "text-dark"
            }`
          }
          style={{ textDecoration: "none" }}
        >
          {item.label}
        </NavLink>
      ))}

      <button
        className="btn btn-outline-danger mt-4 w-100"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}
