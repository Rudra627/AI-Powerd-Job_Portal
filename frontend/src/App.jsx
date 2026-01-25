import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobDetails from "./pages/JobDetails";
import CreatePost from "./pages/CreatePost";
import Sidebar from "./components/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import VerifyEmail from "./components/verifyemail";
// import CompanyLayout from "./layouts/CompanyLayout";
// import CompanyDashboard from "./pages/company/CompanyDashboard";
// import CompanyProfile from "./pages/company/CompanyProfile";
// import PostJob from "./pages/company/PostJob";
// import MyJobs from "./pages/company/MyJobs";
// import Applicants from "./pages/company/Applicants";

function App() {
  return (
    <> <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    <Router>
      <Routes>

        {/* Routes WITH Sidebar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

        </Route>
    {/* <Route element={<CompanyLayout />}>
  <Route path="/company/dashboard" element={<CompanyDashboard />} />
  <Route path="/company/profile" element={<CompanyProfile />} />
  <Route path="/company/post-job" element={<PostJob />} />
  <Route path="/company/jobs" element={<MyJobs />} />
  <Route path="/company/applicants" element={<Applicants />} />
</Route> */}

        {/* Routes WITHOUT Sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
    </>
  );
}

export default App;
