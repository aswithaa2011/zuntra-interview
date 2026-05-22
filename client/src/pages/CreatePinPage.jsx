import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../utils/api";
import Navbar from "../components/Navbar";

const CATEGORIES = ["General","Nature","Architecture","Travel","Food","Fashion","Art","Technology","Interiors","Fitness"];

export default function CreatePinPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", category: "General", tags: "" });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const url = e.target.value;
    setForm(p => ({...p, imageUrl: url}));
    setPreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.imageUrl) return setError("Please provide an image URL");
    setLoading(true);
    try {
      const res = await createPost(form);
      navigate(`/pin/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create pin");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-4xl font-light mb-8 fade-up">Create Pin</h1>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm fade-up">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Image Preview */}
            <div>
              <label className="text-xs font-medium text-[var(--muted)] mb-2 block uppercase tracking-wider">Image URL *</label>
              <input
                className="input-field mb-3"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={handleImageChange}
              />
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--cream)] border-2 border-dashed border-[#ddd] flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" onError={() => setPreview("")} />
                ) : (
                  <div className="text-center text-[var(--muted)]">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-sm">Image preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-[var(--muted)] mb-2 block uppercase tracking-wider">Title *</label>
                <input className="input-field" placeholder="Give your pin a title" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} required />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--muted)] mb-2 block uppercase tracking-wider">Description</label>
                <textarea
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Tell the story behind this image..."
                  value={form.description}
                  onChange={e => setForm(p => ({...p, description: e.target.value}))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--muted)] mb-2 block uppercase tracking-wider">Category</label>
                <select className="input-field" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--muted)] mb-2 block uppercase tracking-wider">Tags</label>
                <input className="input-field" placeholder="nature, minimal, organic (comma separated)" value={form.tags} onChange={e => setForm(p => ({...p, tags: e.target.value}))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => navigate(-1)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? "Publishing..." : "Publish Pin"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
