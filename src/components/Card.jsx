export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-card bg-card p-6 shadow-card backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}
