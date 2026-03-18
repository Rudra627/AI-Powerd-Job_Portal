import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const email = localStorage.getItem("verifyEmail");

  const checkVerification = async () => {
    try {
      const res = await api.get(`/check-verification?email=${email}`);
      const data = res.data;

      if (data.verified) {
        setVerified(true);
        toast.success("Email verified successfully 🎉");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.log("Verification check failed");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkVerification();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const resendVerification = async () => {
    setLoading(true);

    try {
      await api.post("/verification", { email });

      toast.success("Verification email resent 📩");
    } catch (err) {
      toast.error("Failed to resend email");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4 text-center" style={{ width: "420px" }}>
        <h4>Email Verification</h4>

        {!verified ? (
          <>
            <p className="text-muted mt-2">
              A verification link has been sent to:
              <br />
              <strong>{email}</strong>
            </p>

            <div className="spinner-border  my-3"></div>

            <p className="small text-muted">
              Waiting for verification...
            </p>

            <button
              className="btn btn-outline-primary mt-3"
              onClick={resendVerification}
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend Email"}
            </button>
          </>
        ) : (
          <>
            <h5 className="text-success mt-3">Email Verified ✔</h5>
            <p>Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  );
}
