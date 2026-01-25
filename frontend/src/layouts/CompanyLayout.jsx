import { Outlet } from "react-router-dom";
import CompanySidebar from "../company/CompanySidebar";
import Navbar from "../components/Navbar";

export default function CompanyLayout() {
  return (
    <>
      <Navbar />

      <div className="d-flex">
        <div style={{ width: "260px" }}>
          <CompanySidebar />
        </div>

        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}
