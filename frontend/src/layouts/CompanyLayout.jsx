import { Outlet } from "react-router-dom";
import CompanySidebar from "../pages/company/CompanySidebar";
import Navbar from "../components/Navbar";
 
export default function CompanyLayout() {
  return (
    
    <div className="d-flex">

      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          background: "#ffffff",
          borderRight: "1px solid #ddd",
          zIndex: 1000
        }}
      >
        <div style={{ height: "70px", width: "100%" }}>
          <Navbar />
        </div>
        <CompanySidebar />
      </div>

      <div
        className="flex-grow-1"
        style={{
          marginLeft: "250px",
          padding: "25px",
          minHeight: "100vh",
          background: "#f5f7fb",
          marginTop: "70px"
        }}
      >
        <Outlet />
      </div>

    </div>
  );
}
