import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MLayout() {
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
          <Sidebar />
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>

      </div>
    </>
  );
}
