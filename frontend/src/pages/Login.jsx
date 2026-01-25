import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ credential: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CAPTCHA states
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captcha, setCaptcha] = useState("");

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setCaptcha("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async () => {
    setError("");

    // CAPTCHA check
    if (parseInt(captcha) !== num1 + num2) {
      setError("Captcha verification failed");
      toast.error("Captcha incorrect");
      generateCaptcha();
      return;
    }

    if (!form.credential || !form.password) {
      setError("All fields are required");
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
        setError(data.message || "Login failed");
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Store JWT token
      localStorage.setItem("token", data.access_token || data.token);

      // Optional: if backend sends role
      if (data.role) {
        localStorage.setItem("role", data.role);
      }

      toast.success("Login successful 🎉");

      // Redirect to profile or dashboard
      navigate("/profile");

    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-sm p-4" style={{ width: "400px" }}>

        <h4 className="text-center mb-3">Welcome Back 👋</h4>
        <p className="text-muted text-center">
          Login to your JobPortal account
        </p>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <input
          className="form-control mb-2"
          placeholder="Email or Username"
          value={form.credential}
          onChange={e => setForm({ ...form, credential: e.target.value })}
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

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
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-3 mb-0">
          Don’t have an account? <a href="/signup">Signup</a>
        </p>

      </div>
    </div>
  );
}
