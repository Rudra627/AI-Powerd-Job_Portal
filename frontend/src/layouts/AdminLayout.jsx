import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
  // Check if user is admin
  const role = localStorage.getItem("role")?.toLowerCase();
  const token = localStorage.getItem("token");

  if (!token || (role !== "admin" && role !== "superadmin")) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="main-layout-container">
        <div className="sidebar-wrapper">
          <AdminSidebar />
        </div>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>

    </>
  );
}
