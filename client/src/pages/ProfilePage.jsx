import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserPosts, updateProfile } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PinCard from "../components/PinCard";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ bio: "", avatar: "" });
  const [saving, setSaving] = useState(false);

  const isOwn = user?._id === userId;
  const displayUser = isOwn ? user : null;

  useEffect(() => {
    setLoading(true);
    getUserPosts(userId)
      .then(res => setPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (user && isOwn) {
      setProfileForm({ bio: user.bio || "", avatar: user.avatar || "" });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(profileForm);
      updateUser(res.data);
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        {/* Profile Header */}
        <div className="text-center mb-10 fade-up">
          <div className="relative inline-block mb-4">
            {user?.avatar && isOwn ? (
              <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full object-cover ring-4 ring-[var(--accent-light)]" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-3xl font-display font-medium text-[var(--accent)] ring-4 ring-[var(--accent-light)]">
                {(isOwn ? user?.username : userId)?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="font-display text-3xl font-medium mb-1">
            {isOwn ? user?.username : `User`}
          </h1>
          {isOwn && user?.bio && <p className="text-sm text-[var(--muted)] max-w-sm mx-auto">{user.bio}</p>}
          <p className="text-sm text-[var(--muted)] mt-1">{posts.length} pins</p>

          {isOwn && (
            <button onClick={() => setEditing(!editing)} className="btn-outline text-sm py-2 px-5 mt-4">
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          )}
        </div>

        {/* Edit Profile Form */}
        {editing && isOwn && (
          <div className="max-w-md mx-auto mb-10 bg-white rounded-2xl p-6 shadow-sm fade-up">
            <h3 className="font-medium mb-4">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Avatar URL</label>
                <input className="input-field" placeholder="https://..." value={profileForm.avatar} onChange={e => setProfileForm(p => ({...p, avatar: e.target.value}))} />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Bio</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Tell us about yourself..." value={profileForm.bio} onChange={e => setProfileForm(p => ({...p, bio: e.target.value}))} />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="py-12"><Spinner size={40} /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-[var(--muted)] mb-2">No pins yet</p>
            {isOwn && (
              <button onClick={() => navigate("/create")} className="btn-primary mt-4">
                Create your first pin
              </button>
            )}
          </div>
        ) : (
          <div className="masonry-grid">
            {posts.map(post => <PinCard key={post._id} post={post} />)}
          </div>
        )}
      </div>
    </>
  );
}
