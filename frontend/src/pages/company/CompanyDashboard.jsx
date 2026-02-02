import { useNavigate } from "react-router-dom";

export default function Practice() {

  const navigate = useNavigate();

  const chooseLevel = (level) => {
    localStorage.setItem("problem_level", level);
    navigate("/solve-problem");
  };

  return (
    <div className="container mt-5 text-center">

      <h3 className="mb-4">Choose Difficulty Level</h3>

      <button
        className="btn btn-success mx-2"
        onClick={() => chooseLevel("easy")}
      >
        Easy
      </button>

      <button
        className="btn btn-warning mx-2"
        onClick={() => chooseLevel("medium")}
      >
        Medium
      </button>

      <button
        className="btn btn-danger mx-2"
        onClick={() => chooseLevel("hard")}
      >
        Hard
      </button>

    </div>
  );
}
