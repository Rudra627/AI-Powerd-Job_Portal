import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // success | error

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setLoading(false);
      return;
    }
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const res = await fetch(`${API}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Verification failed");
        setStatus("error");
      } else {
        toast.success("Email verified successfully");
        setStatus("success");
      }
    } catch {
      toast.error("Server error");
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="verify-wrapper">

      <div className="verify-card shadow-lg">

        <div className="text-center mb-3">
          <i className="bi bi-envelope-check-fill verify-icon"></i>
        </div>

        <h4 className="text-center mb-3">Email Verification</h4>

        {loading && (
          <>
            <div className="spinner-border text-primary mb-3"></div>
            <p className="text-muted">Verifying your email...</p>
          </>
        )}

        {!loading && status === "success" && (
          <>
            <h5 className="text-success">✔ Email Verified</h5>
            <p className="text-muted">
              Your email has been verified successfully.
            </p>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={() => navigate("/login")}
            >
              Go To Login
            </button>
          </>
        )}

        {!loading && status === "error" && (
          <>
            <h5 className="text-danger">✖ Verification Failed</h5>
            <p className="text-muted">
              Invalid or expired verification link.
            </p>

            <button
              className="btn btn-outline-primary w-100 mt-3"
              onClick={() => navigate("/login")}
            >
              Back To Login
            </button>
          </>
        )}

      </div>

      {/* INLINE CSS */}
      <style>{`
        .verify-wrapper{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          background:linear-gradient(135deg,#4f46e5,#3b82f6);
        }

        .verify-card{
          background:white;
          width:380px;
          padding:35px;
          border-radius:18px;
          text-align:center;
          animation: pop .5s ease;
        }

        .verify-icon{
          font-size:55px;
          color:#3b82f6;
        }

        @keyframes pop{
          from{
            transform:scale(.9);
            opacity:0;
          }
          to{
            transform:scale(1);
            opacity:1;
          }
        }
      `}</style>

    </div>
  );
}
