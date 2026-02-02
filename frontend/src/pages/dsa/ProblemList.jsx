import { useNavigate } from "react-router-dom";

export default function Practice() {
  const navigate = useNavigate();

  const selectLevel = (level) => {
    localStorage.setItem("level", level);
    navigate("/problem");
  };

  return (
    <div className="container mt-5 text-center">
      <h3>Select Difficulty</h3>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-success" onClick={() => selectLevel("easy")}>
          Easy
        </button>

        <button className="btn btn-warning" onClick={() => selectLevel("medium")}>
          Medium
        </button>

        <button className="btn btn-danger" onClick={() => selectLevel("hard")}>
          Hard
        </button>
      </div>
    </div>
  );
}
