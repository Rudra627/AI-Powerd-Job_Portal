import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "company"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CAPTCHA
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captcha, setCaptcha] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setCaptcha("");
  };

  const handleSignup = async () => {
    setError("");

    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (parseInt(captcha) !== num1 + num2) {
      toast.error("Captcha incorrect");
      generateCaptcha();
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/signup", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role
      });

      const data = res.data;

      if (res.status !== 200 && res.status !== 201) {
        toast.error(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      toast.success("Signup successful! Verify your email 📩");
      
      // Save email for verification page
      localStorage.setItem("verifyEmail", form.email);

      navigate("/verify-email");

    } catch (err) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4" style={{ width: "420px" }}>

        <h4 className="text-center mb-2">Create Account 🚀</h4>
        <p className="text-muted text-center mb-3">
          Join JobPortal and explore opportunities
        </p>

        <input
          className="form-control mb-2"
          placeholder="Full Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={e =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
        <select className="form-control mb-2" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="">Select Role</option>
          <option value="company">Company</option>
          <option value="seeker">Employer</option>
        </select>
        {/* CAPTCHA */}
        <div className="border rounded p-2 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Captcha:</strong>
            <button
              className="btn btn-sm btn-light"
              onClick={generateCaptcha}
              type="button"
            >
              ↻
            </button>
          </div>

          <div className="mb-2">
            Solve: <strong>{num1} + {num2} = ?</strong>
          </div>

          <input
            className="form-control"
            placeholder="Enter captcha answer"
            value={captcha}
            onChange={e => setCaptcha(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p className="text-center mt-3 mb-0">
          Already have an account? <a href="/login">Login</a>
        </p>

      </div>
    </div>
  );
}
