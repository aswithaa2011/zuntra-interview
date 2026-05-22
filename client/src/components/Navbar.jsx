import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["All","Nature","Architecture","Travel","Food","Fashion","Art","Technology","Interiors","Fitness"];

export default function Navbar({ onSearch, onCategory, activeCategory }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(search);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-[var(--cream)]/95 backdrop-blur-sm border-b border-[#ede8e0]">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1C4.13 1 1 4.13 1 8c0 2.97 1.77 5.53 4.33 6.71-.06-.52-.11-1.32.02-1.89.13-.52.87-3.7.87-3.7s-.22-.45-.22-1.11c0-1.04.6-1.82 1.35-1.82.64 0 .95.48.95 1.06 0 .64-.41 1.61-.62 2.5-.18.75.37 1.36 1.1 1.36 1.32 0 2.21-1.7 2.21-3.71 0-1.53-1.06-2.61-2.57-2.61-1.75 0-2.78 1.31-2.78 2.67 0 .53.2 1.09.46 1.4.05.06.06.12.04.18l-.17.7c-.03.1-.09.13-.21.08-1-.47-1.62-1.93-1.62-3.1 0-2.52 1.83-4.83 5.28-4.83 2.77 0 4.93 1.98 4.93 4.62 0 2.75-1.74 4.97-4.14 4.97-.81 0-1.57-.42-1.83-.91l-.5 1.86c-.18.69-.66 1.56-.99 2.08.75.23 1.54.36 2.36.36 3.87 0 7-3.13 7-7S11.87 1 8 1z" fill="white"/>
            </svg>
          </div>
          <span className="font-display text-xl font-medium tracking-tight hidden sm:block">Pinvault</span>
        </Link>

        {/* Search */}
        {isHome && (
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="input-field pl-10 py-2.5 text-sm"
                placeholder="Search pins, ideas..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </form>
        )}

        <div className="flex items-center gap-2 ml-auto shrink-0">
          {user ? (
            <>
              <Link to="/create" className="btn-primary text-sm py-2 px-4 hidden sm:block">
                + Create
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-[var(--accent-light)] hover:border-[var(--accent)] transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[var(--accent-light)] flex items-center justify-center text-sm font-medium text-[var(--accent)]">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-xl border border-[#ede8e0] py-2 w-48 z-50">
                    <Link to={`/profile/${user._id}`} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--cream)] transition-colors" onClick={() => setMenuOpen(false)}>
                      <span>👤</span> Profile
                    </Link>
                    <Link to="/saved" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--cream)] transition-colors" onClick={() => setMenuOpen(false)}>
                      <span>🔖</span> Saved Pins
                    </Link>
                    <Link to="/create" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[var(--cream)] transition-colors sm:hidden" onClick={() => setMenuOpen(false)}>
                      <span>➕</span> Create Pin
                    </Link>
                    <hr className="my-1 border-[#ede8e0]" />
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--rose)] hover:bg-[var(--cream)] transition-colors">
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Category Pills */}
      {isHome && (
        <div className="border-t border-[#ede8e0] overflow-x-auto scrollbar-hide">
          <div className="max-w-screen-2xl mx-auto px-4 py-2 flex gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => onCategory?.(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--ink)] text-[var(--cream)]"
                    : "bg-[var(--accent-light)] text-[var(--ink)] hover:bg-[var(--accent)] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
