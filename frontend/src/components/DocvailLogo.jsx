// Reusable Docvail SVG Logo Component — exact match of brand logo
const DocvailLogo = ({ className = "h-8 w-8" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    className={className}
  >
    {/* Outer vertical bar of cross */}
    <rect x="34" y="5" width="32" height="90" rx="16" fill="#4ade80"/>
    {/* Outer horizontal bar of cross */}
    <rect x="5" y="34" width="90" height="32" rx="16" fill="#4ade80"/>
    {/* Inner white channel — vertical */}
    <rect x="43" y="5" width="14" height="90" rx="7" fill="white"/>
    {/* Inner white channel — horizontal */}
    <rect x="5" y="43" width="90" height="14" rx="7" fill="white"/>
    {/* Center block re-fill green (intersection) */}
    <rect x="34" y="34" width="32" height="32" fill="#4ade80"/>
    {/* Center white cross hole */}
    <rect x="43" y="43" width="14" height="14" fill="white"/>
  </svg>
);

export default DocvailLogo;
