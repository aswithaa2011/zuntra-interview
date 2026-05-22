export default function Spinner({ size = 24 }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="spin rounded-full border-2 border-[var(--accent-light)] border-t-[var(--accent)]"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
