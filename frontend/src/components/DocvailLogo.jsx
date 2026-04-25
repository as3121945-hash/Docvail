// Reusable Docvail SVG Logo Component
const DocvailLogo = ({ className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    className={className}
  >
    {/* Outer cross - vertical bar */}
    <rect x="22" y="4" width="20" height="56" rx="10" fill="white" />
    {/* Outer cross - horizontal bar */}
    <rect x="4" y="22" width="56" height="20" rx="10" fill="white" />
    {/* Inner white channel - vertical */}
    <rect x="27.5" y="4" width="9" height="56" rx="4.5" fill="currentColor" />
    {/* Inner white channel - horizontal */}
    <rect x="4" y="27.5" width="56" height="9" rx="4.5" fill="currentColor" />
    {/* Center re-fill */}
    <rect x="22" y="22" width="20" height="20" fill="white" />
    {/* Center hole */}
    <rect x="27.5" y="27.5" width="9" height="9" fill="currentColor" />
  </svg>
);

export default DocvailLogo;
