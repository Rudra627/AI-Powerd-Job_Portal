import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MLayout() {
  return (
    <>
      {/* NAVBAR (TOP, ALWAYS VISIBLE) */}
      <Navbar />

      {/* SIDEBAR + PAGE CONTENT */}
      <div className="d-flex">
        
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
