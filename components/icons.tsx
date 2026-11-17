export function Arrow() {
  return (
    <svg
      className="arrow-icon"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
export function Star() {
  return (
    <svg
      className="star-icon"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d="M50 9v82" transform={`rotate(${i * 18} 50 50)`} />
      ))}
    </svg>
  );
}
