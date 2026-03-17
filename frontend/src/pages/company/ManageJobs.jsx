// ManageJobs.jsx
export default function ManageJobs() {
  return (
    <div className="container mt-4">
      <h4>My Jobs</h4>

      <div className="card p-3 mb-3">
        <h6>Frontend Developer</h6>
        <p>Location: Bangalore</p>

        <button className="btn btn-sm btn-warning me-2">Edit</button>
        <button className="btn btn-sm btn-danger">Delete</button>
      </div>
    </div>
  );
}
