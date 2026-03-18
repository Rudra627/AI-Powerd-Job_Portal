import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_BASE_URL;

export default function SolveProblem() {

  const token = localStorage.getItem("token");

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROBLEM ================= */

  useEffect(() => {

    const level = localStorage.getItem("problem_level");

    if (!token || !level) {
      toast.error("Login & select level first");
      return;
    }

    fetch(`${API}/problem/get_problem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ level })
    })
      .then(res => res.json())
      .then(data => {

        if (data.success) {
          setProblem(data);
          localStorage.setItem("problem_id", data.problem_id);
        } else {
          toast.error(data.message || "No problem found");
        }

      })
      .catch(() => toast.error("Server error"))
      .finally(() => setLoading(false));

  }, []);

  /* ================= CHECK CODE ================= */

  const checkCode = async () => {

    const problem_id = localStorage.getItem("problem_id");

    if (!code.trim()) {
      toast.error("Write code first");
      return;
    }

    try {
      const res = await fetch(`${API}/problem/check_solution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          problem_id,
          code
        })
      });

      const data = await res.json();

      if (data.success) {
        setResult("✅ Correct Answer");
        toast.success("Correct");
      } else {
        setResult("❌ " + data.error);
        toast.error(data.error || "Wrong Answer");
      }

    } catch {
      toast.error("Server error");
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <p className="text-center mt-5">Loading problem...</p>;
  }

  if (!problem) {
    return <p className="text-center mt-5">No problem available</p>;
  }

  return (
    <div className="container mt-4">

      <h4>{problem.title}</h4>

      <p>{problem.description}</p>

      <textarea
        className="form-control"
        rows="12"
        placeholder="Write your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={checkCode}
      >
        Check
      </button>

      {result && (
        <div className="alert alert-info mt-3">
          {result}
        </div>
      )}

    </div>
  );
}
