import { CATEGORY_CHIPS } from "../data";

export default function HomeScreen({
  user,
  feed,
  category,
  onCategory,
  onOpenFilters,
  onOpenPost,
  savedIds,
  onToggleSave,
  votes,
  onVote,
  topics,
  onCreateShowdown,
}) {
  const firstName = getFirstName(user);
  const filtered = feed.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (topics?.length && !topics.includes(item.category)) return false;
    return true;
  });

  return (
    <div className="screen home-screen">
      <header className="home-header">
        <div>
          <p className="eyebrow">Good morning, {firstName}</p>
          <h1>Find your next favorite</h1>
        </div>
        <div className="header-actions">
          <button className="icon-btn" type="button" aria-label="Notifications">
            🔔
          </button>
          <button className="icon-btn icon-btn-fill" type="button" onClick={onOpenPost} aria-label="Add">
            +
          </button>
        </div>
      </header>

      <div className="chip-row">
        <button
          className={`chip chip-filter${topics?.length ? " is-active" : ""}`}
          type="button"
          onClick={onOpenFilters}
        >
          ⌇ Filter
        </button>
        {CATEGORY_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`chip${category === chip.id ? " is-active" : ""}`}
            onClick={() => onCategory(chip.id)}
          >
            <span>{chip.icon}</span> {chip.label}
          </button>
        ))}
      </div>

      <div className="debate-banner">
        <div>
          <strong>Got a movie debate?</strong>
          <p>Let the community decide.</p>
        </div>
        <button className="link-btn" type="button" onClick={onCreateShowdown}>
          Create a Showdown
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">🎬</div>
          <h2>No community picks for this combo yet!</h2>
          <p>Start the conversation with your own hidden gem.</p>
          <button className="btn-primary" type="button" onClick={onOpenPost}>
            Be the first to recommend one (+25 XP)
          </button>
        </div>
      ) : (
        <div className="feed">
          {filtered.map((item) =>
            item.type === "showdown" ? (
              <ShowdownCard
                key={item.id}
                item={item}
                vote={votes[item.id]}
                onVote={onVote}
              />
            ) : (
              <RecommendationCard
                key={item.id}
                item={item}
                saved={savedIds.includes(item.id)}
                onToggleSave={onToggleSave}
              />
            )
          )}

          <div className="daily-showdown">
            <p className="eyebrow light">Daily Showdown</p>
            <h3>Which movie has the more shocking plot twist?</h3>
            <p>Vote to earn +10 XP · 8,420 votes</p>
          </div>
        </div>
      )}
    </div>
  );
}

function RecommendationCard({ item, saved, onToggleSave }) {
  return (
    <article className="card rec-card">
      <div className="rec-top">
        <div className="avatar">{item.handle}</div>
        <div className="rec-meta">
          <strong>{item.author}</strong>
          <span>{item.rank}</span>
        </div>
        <span className="pill">{labelFor(item.category)}</span>
      </div>
      <h3>{item.title}</h3>
      {item.image ? <img src={item.image} alt="" className="rec-image" /> : null}
      {item.quote ? <p className="quote">“{item.quote}”</p> : null}
      <div className="rec-actions">
        <span>↑ {item.upvotes}</span>
        <span>💬 {item.comments} comments</span>
        <button
          className={`save-btn${saved ? " is-saved" : ""}`}
          type="button"
          onClick={() => onToggleSave(item.id)}
          aria-label={saved ? "Unsave" : "Save"}
        >
          {saved ? "🔖" : "📑"}
        </button>
      </div>
    </article>
  );
}

function ShowdownCard({ item, vote, onVote }) {
  return (
    <article className="card showdown-card">
      <div className="rec-top">
        <div className="avatar warm">{item.handle}</div>
        <div className="rec-meta">
          <strong>Showdown by @{item.author}</strong>
          <span>Ends in {item.endsIn}</span>
        </div>
      </div>
      <h3>{item.title}</h3>
      <div className="showdown-grid">
        <button
          type="button"
          className={`showdown-option${vote === item.left.id ? " is-picked" : ""}`}
          onClick={() => onVote(item.id, item.left.id)}
        >
          <img src={item.left.image} alt="" />
          <strong>{item.left.title}</strong>
          <p>{item.left.subtitle}</p>
          <span className="vote-chip">Vote {item.left.title}</span>
        </button>
        <div className="vs">VS</div>
        <button
          type="button"
          className={`showdown-option${vote === item.right.id ? " is-picked" : ""}`}
          onClick={() => onVote(item.id, item.right.id)}
        >
          <img src={item.right.image} alt="" />
          <strong>{item.right.title}</strong>
          <p>{item.right.subtitle}</p>
          <span className="vote-chip">Vote {item.right.title}</span>
        </button>
      </div>
      <div className="rec-actions muted">
        <span>💬 {item.comments} comments</span>
        <span>{item.votes} votes cast</span>
      </div>
    </article>
  );
}

function getFirstName(user) {
  const name = user?.displayName || user?.email || "there";
  return name.split(" ")[0].split("@")[0];
}

function labelFor(category) {
  const map = {
    movies: "🎬 Movies",
    places: "📍 Places",
    songs: "🎵 Songs",
    sports: "🏆 Sports",
    finance: "💰 Finance",
    resources: "📚 Resources",
    events: "🎉 Events",
    lifestyle: "✨ Lifestyle",
    general: "💬 General",
  };
  return map[category] || category;
}
