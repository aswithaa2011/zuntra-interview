import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPost, savePost, likePost, addComment, deletePost } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";

export default function PinDetailPage() {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPost(id)
      .then(res => setPost(res.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><div className="h-[calc(100vh-64px)] flex items-center justify-center"><Spinner size={48} /></div></>;
  if (!post) return null;

  const isSaved = user?.savedPosts?.some(s => (s?._id || s) === post._id);
  const isLiked = user && post.likes?.includes(user._id);
  const isOwner = user?._id === post.author?._id;

  const handleSave = async () => {
    if (!user) return navigate("/login");
    setSaving(true);
    try {
      const res = await savePost(post._id);
      updateUser({ savedPosts: res.data.savedPosts });
    } catch (err) {
      console.error("Save Pin failed:", err.response?.data || err.message);
    }
    setSaving(false);
  };

  const handleLike = async () => {
    if (!user) return navigate("/login");
    try {
      const res = await likePost(post._id);
      setPost(p => ({ ...p, likes: res.data.liked ? [...(p.likes||[]), user._id] : p.likes.filter(l => l !== user._id) }));
    } catch (err) {
      console.error("Like Pin failed:", err.response?.data || err.message);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!comment.trim()) return;
    setCommenting(true);
    try {
      const res = await addComment(post._id, comment);
      setPost(p => ({ ...p, comments: res.data }));
      setComment("");
    } catch (err) {
      console.error("Comment Pin failed:", err.response?.data || err.message);
    }
    setCommenting(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this pin?")) return;
    await deletePost(post._id);
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors">
          ← Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row fade-up">
          {/* Image */}
          <div className="md:w-1/2 bg-[#f5f5f0]">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover max-h-[600px] md:max-h-full" onError={e => { e.target.src = `https://picsum.photos/seed/${post._id}/600/700`; }} />
          </div>

          {/* Content */}
          <div className="md:w-1/2 flex flex-col p-6 md:p-8 overflow-y-auto max-h-[600px]">
            {/* Actions */}
            <div className="flex items-center gap-2 mb-5">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`btn-primary py-2 px-5 text-sm ${isSaved ? "bg-[var(--rose)]" : ""}`}
              >
                {saving ? "..." : isSaved ? "Saved ✓" : "Save"}
              </button>
              <button onClick={handleLike} className="btn-outline py-2 px-4 text-sm flex items-center gap-1.5">
                {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0}
              </button>
              {isOwner && (
                <button onClick={handleDelete} className="ml-auto text-sm text-[var(--rose)] hover:underline">Delete</button>
              )}
            </div>

            {/* Meta */}
            <div className="mb-1">
              <span className="text-xs text-[var(--accent)] font-medium uppercase tracking-wider">{post.category}</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-medium mb-3 leading-tight">{post.title}</h1>
            {post.description && <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">{post.description}</p>}

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-[var(--accent-light)] text-[var(--muted)] px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            )}

            {/* Author */}
            <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--cream)] transition-colors mb-5">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt={post.author.username} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center font-medium text-[var(--accent)]">
                  {post.author?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium text-sm">{post.author?.username}</p>
                {post.author?.bio && <p className="text-xs text-[var(--muted)] truncate max-w-[200px]">{post.author.bio}</p>}
              </div>
            </Link>

            {/* Comments */}
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-3">Comments ({post.comments?.length || 0})</h3>
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-1">
                {post.comments?.length === 0 && <p className="text-xs text-[var(--muted)]">Be the first to comment</p>}
                {post.comments?.map((c, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-xs font-medium text-[var(--accent)] shrink-0">
                      {c.user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-medium">{c.user?.username} </span>
                      <span className="text-xs text-[var(--muted)]">{c.text}</span>
                    </div>
                  </div>
                ))}
              </div>
              {user && (
                <form onSubmit={handleComment} className="flex gap-2">
                  <input
                    className="input-field text-sm py-2"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                  <button type="submit" className="btn-primary py-2 px-4 text-sm shrink-0" disabled={commenting}>
                    Post
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
