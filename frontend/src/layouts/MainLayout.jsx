import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* NAVBAR (TOP, FIXED) */}
      <div className="navbar-wrapper">
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      </div>

      {/* SIDEBAR + PAGE CONTENT */}
      <div className="main-layout-container">

        {/* CONSTANT SIDEBAR */}
        <div className={`sidebar-wrapper ${sidebarOpen ? 'active' : ''}`}>
          <Sidebar isOpen={sidebarOpen} />
        </div>

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="mobile-overlay d-lg-none"
            onClick={handleOverlayClick}
          />
        )}

        {/* PAGE CONTENT */}
        <div className="content-wrapper">
          <Outlet />
        </div>

      </div>

    </>
  );
}
