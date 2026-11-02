// Flat two-colour mark: an open focus ring with a pen flick and one off-centre dot.
// Slightly tilted and uneven on purpose, so it reads as drawn rather than generated.
export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="FocusEngine logo" style={{ flex: 'none' }}>
      <g transform="rotate(-3 24 24)">
        <rect x="4" y="4" width="40" height="40" rx="11" fill="#4f46e5" />
        <path d="M33 12.5C28 8.2 19.5 8.6 15 14C10.4 19.5 11 28.6 16.8 33.3C22.5 38 31.4 37.2 35.8 31.2C38.4 27.6 38.9 23.2 37.4 19.6"
          fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M33.2 12.4L37.8 8.6" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="24.6" cy="23.4" r="4" fill="#fbbf24" />
      </g>
    </svg>
  );
}
