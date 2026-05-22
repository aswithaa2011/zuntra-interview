import { useState, useEffect } from "react";
import { getSavedPosts } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PinCard from "../components/PinCard";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";

export default function SavedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = () => {
    getSavedPosts()
      .then(res => setPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSaved(); }, [user]);

  return (
    <>
      <Navbar />
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="mb-8 fade-up">
          <h1 className="font-display text-4xl font-light mb-1">Saved Pins</h1>
          <p className="text-sm text-[var(--muted)]">{posts.length} pins saved</p>
        </div>

        {loading ? (
          <div className="py-12"><Spinner size={40} /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-[var(--muted)] mb-2">Nothing saved yet</p>
            <p className="text-sm text-[var(--muted)]">Browse the feed and hit Save on pins you love</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {posts.map(post => (
              <PinCard
                key={post._id}
                post={post}
                onSaveToggle={fetchSaved}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
