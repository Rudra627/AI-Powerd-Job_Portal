import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "https://dt20tzx0-5000.inc1.devtunnels.ms/content";

export default function Feed() {

  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  /* ================= LOAD POSTS ================= */

  const loadPosts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/view_posts?page=${page}&limit=5`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      const data = await res.json();

      if (data.posts) {
        setPosts(prev => [...prev, ...data.posts]);
        setPage(prev => prev + 1);
      }

    } catch {
      toast.error("Failed to load posts");
    }

    setLoading(false);
  };

  /* ================= LIKE ================= */

  const likePost = async (id) => {
    try {
      const res = await fetch(`${API}/like_post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ post_id: id })
      });

      const data = await res.json();

      setPosts(posts.map(p =>
        p.id === id
          ? { ...p, like_count: data.like_count }
          : p
      ));

    } catch {
      toast.error("Like failed");
    }
  };

  /* ================= COMMENTS ================= */

  const toggleComments = async (id) => {
    if (openComments === id) {
      setOpenComments(null);
      return;
    }

    setOpenComments(id);
    loadComments(id);
  };

  const loadComments = async (id) => {
    try {
      const res = await fetch(`${API}/view_comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ post_id: id })
      });

      const data = await res.json();
      setComments(prev => ({ ...prev, [id]: data.comments || [] }));

    } catch {
      toast.error("Failed to load comments");
    }
  };

  const postComment = async (id) => {
    if (!commentText.trim()) return;

    try {
      await fetch(`${API}/comment_post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          post_id: id,
          comment: commentText
        })
      });

      setCommentText("");
      loadComments(id);

    } catch {
      toast.error("Comment failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      {posts.map(post => (

        <div key={post.id} className="card mb-3 shadow-sm">

          {/* AUTHOR */}
          <div className="d-flex align-items-center p-3">
            <img
              src={post.user_photo}
              width="45"
              height="45"
              className="rounded-circle border me-2"
              alt=""
            />
            <strong>{post.name}</strong>
          </div>

          {/* IMAGE */}
          {post.photo_url && (
            <img
              src={post.photo_url}
              className="w-100"
              style={{ maxHeight: "420px", objectFit: "cover" }}
              alt=""
            />
          )}

          {/* BODY */}
          <div className="p-3">

            <p className="mb-2">{post.caption}</p>

            <div className="text-muted small mb-2">
              👍 {post.like_count} &nbsp; 💬 {post.comment_count}
            </div>

            {/* ACTIONS */}
            <div className="d-flex gap-2 mb-2">

              <button
                className="btn btn-primary btn-sm w-50"
                onClick={() => likePost(post.id)}
              >
                👍 Like
              </button>

              <button
                className="btn btn-outline-primary btn-sm w-50"
                onClick={() => toggleComments(post.id)}
              >
                💬 Comments
              </button>

            </div>

            {/* COMMENTS */}
            {openComments === post.id && (

              <div>

                <div className="d-flex gap-2 mb-2">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Write comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => postComment(post.id)}
                  >
                    Post
                  </button>
                </div>

                {comments[post.id]?.length === 0 && (
                  <p className="text-muted small">
                    No comments yet
                  </p>
                )}

                {comments[post.id]?.map((c, i) => (
                  <div
                    key={i}
                    className="bg-light rounded p-2 mb-1 small"
                  >
                    <strong className="text-primary">
                      {c.name}
                    </strong>: {c.comment_text}
                  </div>
                ))}

              </div>

            )}

          </div>

        </div>

      ))}

      {/* LOAD MORE */}

      <button
        onClick={loadPosts}
        className="btn btn-outline-primary w-100"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load More"}
      </button>

    </div>
  );
}
