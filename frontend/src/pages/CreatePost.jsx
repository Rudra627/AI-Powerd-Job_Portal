import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import "./CreatePost.css";   // 👈 add this

export default function CreatePost() {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("public");
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE TO BASE64 ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be less than 3MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ================= CREATE POST ================= */

  const handlePost = async () => {
    if (!caption && !image) {
      toast.error("Write caption or select image");
      return;
    }

    try {
      const res = await api.post("/content/image_post", {
        caption,
        image,
        status
      });

      const data = res.data;

      if (res.status !== 200 && res.status !== 201) {
        toast.error(data.error || "Post failed");
        setLoading(false);
        return;
      }

      toast.success("Post created 🚀");
      navigate("/");

    } catch (err) {
      toast.error("Server error");
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <>

      {/* 🔥 LOADER */}
      {loading && (
        <div className="d-flex justify-content-center mt-5">
          <div className="liquid-loader">
            <div className="loading-text">
              Loading
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>

            <div className="loader-track">
              <div className="liquid-fill"></div>
            </div>
          </div>
        </div>
      )}

      {/* FORM */}
      {!loading && (
        <div className="container mt-5 w-50">

          <h4>Create Post</h4>

          {/* CAPTION */}
          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="What do you want to share?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* IMAGE INPUT */}
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={handleImageChange}
          />

          {/* PREVIEW */}
          {preview && (
            <div className="mb-3 text-center">
              <img
                src={preview}
                alt="preview"
                style={{ maxWidth: "100%", maxHeight: "250px" }}
                className="rounded border"
              />
            </div>
          )}

          {/* STATUS */}
          <select
            className="form-control mb-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          {/* BUTTON */}
          <button
            className="btn btn-primary w-100"
            onClick={handlePost}
          >
            Post
          </button>

        </div>
      )}

    </>
  );
}
