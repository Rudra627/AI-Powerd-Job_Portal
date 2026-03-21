import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import SpinnerLoader from "../components/SpinnerLoader";
import "./CreatePost.css";

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

    setLoading(true);

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

      {/* FORM */}
      <div className={`container mt-5 w-50 ${loading ? "opacity-50" : ""}`} style={{ pointerEvents: loading ? "none" : "auto" }}>

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
            className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
            onClick={handlePost}
            disabled={loading}
            style={{ height: "45px" }}
          >
            {loading ? (
              <>
                <SpinnerLoader size="1.5rem" color="#ffffff" />
                <span>Publishing...</span>
              </>
            ) : (
              "Post"
            )}
          </button>

        </div>

    </>
  );
}
