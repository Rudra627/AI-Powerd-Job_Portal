import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layouts/MainLayout";
import CompanyLayout from "./layouts/CompanyLayout";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
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

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <Router>
        <Routes>

          {/* ================= USER LAYOUT ================= */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/coding-problem" element={<Practice />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/solveproblem" element={<SolveProblem />} />
          </Route>

      
<Route element={<CompanyLayout />}>
  <Route path="/company/dashboard" element={<CompanyDashboard />} />
  <Route path="/company/profile" element={<CompanyProfile />} />
  <Route path="/company/post-job" element={<PostJob />} />
  <Route path="/company/jobs" element={<MyJobs />} />
  <Route path="/company/applicants" element={<Applicants />} />
</Route>

          {/* ================= AUTH ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </Router>
    </>
  );
}

export default App;
