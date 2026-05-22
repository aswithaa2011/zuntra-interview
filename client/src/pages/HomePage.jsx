import { useState, useEffect, useRef, useCallback } from "react";
import { getPosts } from "../utils/api";
import PinCard from "../components/PinCard";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const fetchPosts = useCallback(async (pg, q, cat, reset = false) => {
    setLoading(true);
    try {
      const res = await getPosts({ page: pg, limit: 20, search: q || undefined, category: cat === "All" ? undefined : cat });
      const newPosts = res.data.posts;
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(pg < res.data.pages);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    fetchPosts(1, search, category, true);
  }, [search, category]);

  useEffect(() => {
    if (page > 1) fetchPosts(page, search, category);
  }, [page]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasMore && !loading) setPage(p => p + 1); },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      <Navbar
        onSearch={setSearch}
        onCategory={setCategory}
        activeCategory={category}
      />
      <main className="max-w-screen-2xl mx-auto px-4 pt-6 pb-16">
        {posts.length === 0 && !loading ? (
          <div className="text-center py-24 fade-up">
            <p className="font-display text-3xl text-[var(--muted)] mb-2">No pins found</p>
            <p className="text-sm text-[var(--muted)]">Try a different search or category</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {posts.map(post => (
              <PinCard key={post._id} post={post} />
            ))}
          </div>
        )}
        <div ref={sentinelRef} className="h-10" />
        {loading && <div className="py-8"><Spinner size={36} /></div>}
      </main>
    </>
  );
}
