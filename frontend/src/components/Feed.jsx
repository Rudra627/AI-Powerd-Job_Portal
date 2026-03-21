import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function Feed() {

  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState("");
  const isFetching = useRef(false);

  useEffect(() => {
    loadPosts();
  }, []);

  /* ================= LOAD POSTS ================= */

  const loadPosts = async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      setLoading(true);

      const res = await api.get(`/content/view_posts?page=${page}&limit=5`);
      const data = res.data;

      if (data.posts) {
        setPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPosts = data.posts.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
        setPage(prev => prev + 1);
      }

    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  /* ================= LIKE ================= */

  const likePost = async (id) => {
    try {
      const res = await api.post("/content/like_post", { post_id: id });
      const data = res.data;

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
      const res = await api.post("/content/view_comments", { post_id: id });
      const data = res.data;
      setComments(prev => ({ ...prev, [id]: data.comments || [] }));

    } catch {
      toast.error("Failed to load comments");
    }
  };

  const postComment = async (id) => {
    if (!commentText.trim()) return;

    try {
      await api.post("/content/comment_post", {
        post_id: id,
        comment: commentText
      });

      setCommentText("");
      loadComments(id);

    } catch {
      toast.error("Comment failed");
    }
  };
  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>

      <h4 className="text-center text-primary mb-4">
        Public Feed
      </h4>

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
            <strong>{post.full_name}</strong>
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
                      {c.full_name}
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
