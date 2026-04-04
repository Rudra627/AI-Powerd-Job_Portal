import { Link } from "react-router-dom";

export default function JobPost({ post }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">

        <h6 className="mb-1">{post.company}</h6>
        <small className="text-muted">{post.location}</small>

        <h5 className="mt-2">{post.title}</h5>
        <p className="text-muted">{post.description}</p>

        <div className="mb-2">
          {post.skills.map((skill, i) => (
            <span key={i} className="badge bg-secondary me-2">
              {skill}
            </span>
          ))}
        </div>

     
        <div className="d-flex justify-content-between text-muted small mb-2">
          <span>{post.likes} Likes</span>
          <span>{post.comments} Comments</span>
        </div>

      
        <div className="d-flex justify-content-between">
          <button className="btn btn-outline-primary btn-sm">
            👍 Like
          </button>

          <Link to={`/jobs/${post.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
}
