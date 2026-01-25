export default function UserPost({ post }) {
  return (
    <div className="card mb-3 shadow-sm">

      <div className="card-body">

        {/* HEADER */}
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <img
              src={post.profileImage}
              alt="profile"
              className="rounded-circle me-2"
              width="48"
              height="48"
            />

            <div>
              <h6 className="mb-0">{post.name}</h6>
              <small className="text-muted">{post.role}</small>
              <div className="text-muted" style={{ fontSize: "12px" }}>
                {post.time} • 🌍
              </div>
            </div>
          </div>

          <i className="bi bi-three-dots"></i>
        </div>

        {/* POST TEXT */}
        <p className="mt-3 mb-2">
          {post.content}
        </p>

        {/* IMAGE (OPTIONAL) */}
        {post.image && (
          <img
            src={post.image}
            alt="post"
            className="img-fluid rounded mb-2"
          />
        )}

        {/* LIKE & COMMENT COUNT */}
        <div className="d-flex justify-content-between text-muted small mt-2">
          <span>👍 {post.likes}</span>
          <span>{post.comments} comments</span>
        </div>

        <hr />

        {/* ACTION BUTTONS */}
        <div className="d-flex justify-content-around text-muted">

          <button className="btn btn-light btn-sm">
            <i className="bi bi-hand-thumbs-up"></i> Like
          </button>

          <button className="btn btn-light btn-sm">
            <i className="bi bi-chat-dots"></i> Comment
          </button>

          <button className="btn btn-light btn-sm">
            <i className="bi bi-arrow-repeat"></i> Repost
          </button>

          <button className="btn btn-light btn-sm">
            <i className="bi bi-send"></i> Send
          </button>

        </div>

      </div>
    </div>
  );
}
