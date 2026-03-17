import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Practice() {
  const [level, setLevel] = useState("easy");
  const navigate = useNavigate();

  const startPractice = () => {
    navigate(`/dsa/problems?level=${level}`);
  };

  return (
    <div className="container mt-5 w-50">

      <h3 className="mb-4">DSA Practice</h3>
      <select
        className="form-control mb-4"
        value={level}
        onChange={e => setLevel(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Intermediate</option>
        <option value="hard">Hard</option>
      </select>

      <button
        className="btn btn-primary w-100"
        onClick={startPractice}
      >
        Find Problems
      </button>

    </div>
  );
}
