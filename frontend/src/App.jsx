import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layouts/MainLayout";
import CompanyLayout from "./layouts/CompanyLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";

import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import Viewjobs from "./pages/Viewjobs"; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobDetails from "./pages/JobDetails";
import CreatePost from "./pages/CreatePost";
import VerifyEmail from "./components/verifyemail";
import Practice from "./pages/dsa/Practice";
// import Practice from "./pages/dsa/Practice";
import ProblemList from "./pages/dsa/ProblemList";
import SolveProblem from "./pages/dsa/SolveProblem";

import CompanyDashboard from "./pages/company/CompanyDashboard.jsx";
import CompanyProfile from "./pages/company/CompanyProfile.jsx";
import PostJob from "./pages/company/PostJob.jsx";
import MyJobs from "./pages/company/MyJobs.jsx";
import Applicants from "./pages/company/Applicants.jsx";
import JobApplicants from "./pages/company/JobApplicants.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminCompanies from "./pages/admin/AdminCompanies.jsx";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <Router>
        <Routes>

          {/* ================= PUBLIC / LANDING ================= */}
          <Route path="/" element={token ? (role === "company" ? <Navigate to="/company/" /> : <Navigate to="/feed" />) : <Login />} />

          {/* ================= USER LAYOUT ================= */}
          <Route element={<Layout />}>
            <Route path="/feed" element={<Home />} />
            <Route path="/ViewDetails" element={<Viewjobs />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
                    </Route>

      
<Route element={<CompanyLayout />}>
  <Route path="/company/" element={<Home />} />
  <Route path="/company/dashboard" element={<CompanyDashboard />} />
  <Route path="/company/profile" element={<CompanyProfile />} />
  <Route path="/company/post-job" element={<PostJob />} />
  <Route path="/company/company_jobs" element={<MyJobs />} />
  <Route path="/company/post" element={<CreatePost />} />
  <Route path="/company/applications/:jobId" element={<JobApplicants />} />
  <Route path="/company/applicants" element={<Applicants />} />
</Route>

{/* ================= ADMIN LAYOUT ================= */}
<Route element={<AdminLayout />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path="/admin/companies" element={<AdminCompanies />} />
</Route>         
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
