const TABS = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "champions", label: "Champions", icon: TrophyIcon },
  { id: "post", label: "Post", icon: PlusIcon, center: true },
  { id: "quizzes", label: "Quizzes", icon: BoltIcon },
  { id: "profile", label: "My XP", icon: PersonIcon },
];

export default function BottomNav({ active, onChange, onPost }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        if (tab.center) {
          return (
            <button
              key={tab.id}
              className="nav-post"
              onClick={onPost}
              aria-label="Post recommendation"
              type="button"
            >
              <span className="nav-post-btn">
                <Icon />
              </span>
              <span className="nav-label">{tab.label}</span>
            </button>
          );
        }

        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-item${isActive ? " is-active" : ""}`}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            <Icon filled={isActive} />
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrophyIcon({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 5h8v4a4 4 0 0 1-8 0V5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8 6H5a3 3 0 0 0 3 5M16 6h3a3 3 0 0 1-3 5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 20h6M12 13v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function BoltIcon({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PersonIcon({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 19.2c1.4-3 4-4.7 7-4.7s5.6 1.7 7 4.7"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
