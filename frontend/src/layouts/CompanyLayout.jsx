import { Outlet } from "react-router-dom";
import CompanySidebar from "../pages/company/CompanySidebar";
import Navbar from "../components/Navbar";
 
export default function CompanyLayout() {
  return (
    
    <>
      {/* NAVBAR (TOP, FIXED) */}
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      {/* SIDEBAR + PAGE CONTENT */}
      <div className="main-layout-container">
        
        {/* CONSTANT SIDEBAR */}
        <div className="sidebar-wrapper">
          <CompanySidebar />
        </div>

        {/* PAGE CONTENT */}
        <div className="content-wrapper">
          <Outlet />
        </div>

      </div>

    </>
  );
}
