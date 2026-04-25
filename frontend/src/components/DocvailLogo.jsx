// Docvail Logo — using exact brand image provided
const DocvailLogo = ({ className = "h-8 w-8" }) => (
  <img
    src="/logo.png"
    alt="Docvail Logo"
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

export default DocvailLogo;
