import { BADGES, GENRE_MASTERY, LEVELS } from "../data";

export default function ProfileScreen({
  user,
  totalXp,
  picks,
  savedCount,
  onOpenSaved,
  onSignOut,
}) {
  const name = user?.displayName || "Your Name";
  const handle = user?.email ? `@${user.email.split("@")[0]}` : "@yourhandle";
  const initials = getInitials(user);

  return (
    <div className="screen profile-screen">
      <header className="profile-hero card">
        {user?.photoURL ? (
          <img className="avatar xl photo" src={user.photoURL} alt="" />
        ) : (
          <div className="avatar xl">{initials}</div>
        )}
        <div>
          <h1>{name}</h1>
          <p>{handle}</p>
          <span className="gold-chip">🏅 Top 5% Curator — All Categories</span>
        </div>
        <button type="button" className="text-link signout" onClick={onSignOut}>
          Sign out
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{picks.length}</strong>
          <span>Picks Shared</span>
        </div>
        <div className="stat-card">
          <strong>2,841</strong>
          <span>Total Upvotes</span>
        </div>
        <div className="stat-card">
          <strong>{totalXp.toLocaleString()}</strong>
          <span>Total XP</span>
        </div>
      </div>

      <section className="card">
        <div className="section-row">
          <h2>Level 12 — Curator</h2>
          <span className="muted">{totalXp.toLocaleString()} / 7,000 XP</span>
        </div>
        <div className="progress">
          <span style={{ width: "68%" }} />
        </div>
        <p className="muted">68% to Level 13 — Tastemaker</p>
      </section>

      <section>
        <h2 className="section-title">Universal Level Progression</h2>
        <p className="muted tight">Cross-category XP</p>
        <div className="card">
          {LEVELS.map((level) => (
            <div key={level.level} className={`level-row${level.current ? " is-current" : ""}`}>
              <span className={`check${level.level <= 12 ? " done" : ""}`}>
                {level.level <= 12 ? "✓" : level.level}
              </span>
              <div>
                <strong>
                  Level {level.level}: {level.title}
                </strong>
                <p>{level.detail}</p>
              </div>
              <span className="muted">{level.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-row">
          <h2 className="section-title">Earned Badges & Expertise</h2>
          <span className="muted">Across your interests</span>
        </div>
        <p className="tiny caps">Overall rank</p>
        <div className="badge-row">
          {BADGES.map((badge) => (
            <div key={badge.id} className="badge-card">
              <div className={`badge-icon ${badge.tone}`}>{badge.icon}</div>
              <strong>{badge.name}</strong>
              <p>{badge.meta}</p>
            </div>
          ))}
        </div>

        <p className="tiny caps">Genre mastery</p>
        <div className="mastery-grid">
          {GENRE_MASTERY.map((item) => (
            <div key={item.id} className="mastery-card">
              <div className="mastery-icon">{item.icon}</div>
              <strong>{item.name}</strong>
              <p>{item.meta}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="tabs">
        <button type="button" className="is-active">
          My Picks ({picks.length})
        </button>
        <button type="button" onClick={onOpenSaved}>
          Saved Items ({savedCount})
        </button>
      </div>

      <div className="picks-list">
        {picks.map((item) => (
          <article key={item.id} className="pick-row">
            <span className={`dot ${item.category}`} />
            <div>
              <span className="tiny">{item.category}</span>
              <strong>{item.title}</strong>
            </div>
            <span className="muted">↑ {item.upvotes || 15}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function getInitials(user) {
  const name = user?.displayName || user?.email || "YO";
  const parts = name.replace(/@.*/, "").split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
