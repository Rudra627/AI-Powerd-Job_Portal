import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerLoader from "../components/SpinnerLoader";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    credential: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CAPTCHA
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captcha, setCaptcha] = useState("");

  /* ================= CAPTCHA ================= */

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setCaptcha("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  /* ================= LOGIN ================= */

  const handleLogin = async () => {

    setError("");

    if (parseInt(captcha) !== num1 + num2) {
      toast.error("Captcha incorrect");
      generateCaptcha();
      return;
    }

    if (!form.credential || !form.password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        "https://dt20tzx0-5000.inc1.devtunnels.ms/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      /* ================= SAVE TOKEN & ROLE ================= */

      localStorage.setItem("token", data.access_token || data.token);

      if (data.role) {
        localStorage.setItem("role", data.role);
      }

      toast.success("Login successful 🎉");

      /* ================= ROLE REDIRECT ================= */

      const role = data.role?.toLowerCase();

      if (role === "admin" || role === "superadmin") {
        window.location.href = "/admin/dashboard";
      } else if (role === "company") {
        window.location.href = "/company/";
      } else {
        window.location.href = "/feed";
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div className="container-fluid p-responsive d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>

      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>


        <h4 className="text-center mb-2">Welcome Back 👋</h4>
        <p className="text-muted text-center">Login to your account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* EMAIL / USERNAME */}
        <input
          className="form-control mb-2"
          placeholder="Email or Username"
          value={form.credential}
          onChange={(e) =>
            setForm({ ...form, credential: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* CAPTCHA */}
        <div className="border rounded p-2 mb-3">

          <div className="d-flex justify-content-between">
            <strong>Captcha</strong>
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={generateCaptcha}
            >
              ↻
            </button>
          </div>

          <p className="mt-1">
            Solve: <b>{num1} + {num2}</b>
          </p>

          <input
            className="form-control"
            placeholder="Enter answer"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
          />

        </div>

        {/* LOGIN BUTTON */}
        <button
          className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
          onClick={handleLogin}
          disabled={loading}
          style={{ height: "45px" }}
        >
          {loading ? (
            <>
              <SpinnerLoader size="1.5rem" color="#ffffff" />
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center mt-3">
          Don’t have an account? <a href="/signup">Signup</a>
        </p>

      </div>
    </div>
  );
}
