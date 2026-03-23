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
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000, background: "white" }}>
        <Navbar />
      </div>

      <div className="d-flex" style={{ marginTop: "70px" }}>
        <div style={{ width: "260px" }}>
          <AdminSidebar />
        </div>

        <div className="flex-grow-1 p-4" style={{ minHeight: "calc(100vh - 70px)", background: "#f8f9fa" }}>
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
