export default function GoldCoin({ size = 16, style = {}, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`gold-coin-svg ${className}`}
      style={{
        display: "inline-block",
        verticalAlign: "-0.16em",
        marginRight: "3px",
        flexShrink: 0,
        ...style,
      }}
      aria-label="gold coin"
    >
      <defs>
        <linearGradient id="goldCoinRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF475" />
          <stop offset="30%" stopColor="#FFC700" />
          <stop offset="70%" stopColor="#E69500" />
          <stop offset="100%" stopColor="#B36B00" />
        </linearGradient>
        <linearGradient id="goldCoinFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE566" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodColor="#B45309" floodOpacity="0.4" />
        </filter>
      </defs>
      {/* Outer golden rim */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="url(#goldCoinRim)"
        stroke="#92400E"
        strokeWidth="0.8"
        filter="url(#goldGlow)"
      />
      {/* Inner gold face */}
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="url(#goldCoinFace)"
        stroke="#FDE68A"
        strokeWidth="0.8"
      />
      {/* Golden star emblem */}
      <path
        d="M12 5.8L13.7 9.8L18 10.2L14.7 13.1L15.6 17.3L12 15.1L8.4 17.3L9.3 13.1L6 10.2L10.3 9.8L12 5.8Z"
        fill="#FFFDF0"
        stroke="#B45309"
        strokeWidth="0.5"
      />
    </svg>
  );
}
