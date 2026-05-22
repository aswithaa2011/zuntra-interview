import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] flex">
      <div className="hidden lg:flex flex-1 bg-[var(--teal-light)] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=800')", backgroundSize: "cover", backgroundPosition: "center"}} />
        <div className="relative text-center px-12">
          <h1 className="font-display text-6xl font-light text-[var(--ink)] mb-4 leading-tight">Save what<br /><em>moves</em><br />you.</h1>
          <p className="text-[var(--muted)] text-sm max-w-xs">Join thousands curating the world's most beautiful imagery.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm fade-up">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-full bg-[var(--ink)] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1C4.13 1 1 4.13 1 8c0 2.97 1.77 5.53 4.33 6.71-.06-.52-.11-1.32.02-1.89.13-.52.87-3.7.87-3.7s-.22-.45-.22-1.11c0-1.04.6-1.82 1.35-1.82.64 0 .95.48.95 1.06 0 .64-.41 1.61-.62 2.5-.18.75.37 1.36 1.1 1.36 1.32 0 2.21-1.7 2.21-3.71 0-1.53-1.06-2.61-2.57-2.61-1.75 0-2.78 1.31-2.78 2.67 0 .53.2 1.09.46 1.4.05.06.06.12.04.18l-.17.7c-.03.1-.09.13-.21.08-1-.47-1.62-1.93-1.62-3.1 0-2.52 1.83-4.83 5.28-4.83 2.77 0 4.93 1.98 4.93 4.62 0 2.75-1.74 4.97-4.14 4.97-.81 0-1.57-.42-1.83-.91l-.5 1.86c-.18.69-.66 1.56-.99 2.08.75.23 1.54.36 2.36.36 3.87 0 7-3.13 7-7S11.87 1 8 1z" fill="white"/>
              </svg>
            </div>
            <span className="font-display text-xl font-medium">Pinvault</span>
          </Link>

          <h2 className="font-display text-3xl font-light mb-1">Create account</h2>
          <p className="text-sm text-[var(--muted)] mb-8">Start your visual collection today</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Username</label>
              <input className="input-field" placeholder="coolcreator" value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))} required />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--muted)] mb-1.5 block uppercase tracking-wider">Password</label>
              <input className="input-field" type="password" placeholder="min 6 characters" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required />
            </div>
            <button type="submit" className="btn-primary w-full py-3 mt-2" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-center text-[var(--muted)] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--ink)] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
