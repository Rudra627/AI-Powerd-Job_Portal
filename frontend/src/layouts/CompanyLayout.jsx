import { Outlet } from "react-router-dom";
import CompanySidebar from "../pages/company/CompanySidebar";
import Navbar from "../components/Navbar";
 
export default function CompanyLayout() {
  return (
    
    <>
      {/* NAVBAR (TOP, FIXED) */}
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000, background: "white" }}>
        <Navbar />
      </div>

      {/* SIDEBAR + PAGE CONTENT */}
      <div className="d-flex" style={{ marginTop: "70px" }}>
        
        {/* CONSTANT SIDEBAR */}
        <div style={{ width: "260px" }}>
          <CompanySidebar />
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-grow-1 p-4" style={{ minHeight: "calc(100vh - 70px)", background: "#f5f7fb" }}>
          <Outlet />
        </div>

      </div>
    </>
  );
}
