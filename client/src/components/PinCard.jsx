import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { savePost, likePost } from "../utils/api";

export default function PinCard({ post, onSaveToggle }) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [saving, setSaving] = useState(false);

  const isSaved = user?.savedPosts?.some(id => (id?._id || id) === post._id);
  const isLiked = user && post.likes?.includes(user._id);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    setSaving(true);
    try {
      const res = await savePost(post._id);
      updateUser({ savedPosts: res.data.savedPosts });
      onSaveToggle?.();
    } catch {}
    setSaving(false);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    try {
      const res = await likePost(post._id);
      setLikes(res.data.likes);
    } catch {}
  };

  return (
    <div
      className="pin-card masonry-item cursor-pointer group"
      onClick={() => navigate(`/pin/${post._id}`)}
    >
      <div className="relative rounded-2xl overflow-hidden bg-[#eee]">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full object-cover block"
          loading="lazy"
          onError={e => { e.target.src = `https://picsum.photos/seed/${post._id}/400/500`; }}
        />
        {/* Overlay */}
        <div className="overlay-fade absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent">
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-md ${
                isSaved
                  ? "bg-[var(--rose)] text-white"
                  : "bg-white text-[var(--ink)] hover:bg-[var(--accent)] hover:text-white"
              }`}
            >
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full truncate max-w-[60%]">
              {post.title}
            </span>
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-white text-xs bg-black/30 px-2 py-1 rounded-full hover:bg-black/50 transition-colors"
            >
              <span>{isLiked ? "❤️" : "🤍"}</span>
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="pt-2 pb-1 px-0.5">
        <div className="flex items-center gap-1.5">
          {post.author?.avatar ? (
            <img src={post.author.avatar} alt={post.author.username} className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[9px] font-medium text-[var(--accent)]">
              {post.author?.username?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-xs text-[var(--muted)]">{post.author?.username}</span>
        </div>
      </div>
    </div>
  );
}
