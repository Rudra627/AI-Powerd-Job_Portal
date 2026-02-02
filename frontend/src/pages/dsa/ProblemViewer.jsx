import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://dt20tzx0-5000.inc1.devtunnels.ms";

export default function ProblemViewer() {

  const [problem, setProblem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const level = localStorage.getItem("level");

    fetch(`${API}/problem/get_problem`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProblem(data);
          localStorage.setItem("problem_id", data.problem_id);
        }
      });
  }, []);

  if (!problem) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <h4>{problem.title}</h4>
      <p>{problem.description}</p>

      <button
        className="btn btn-primary"
        onClick={() => navigate("/solve")}
      >
        Solve Problem
      </button>
    </div>
  );
}
