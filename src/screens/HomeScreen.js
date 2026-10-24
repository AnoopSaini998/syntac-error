import { useState } from "react";
import { CATEGORY_CHIPS, NOTIFICATIONS } from "../data";

export default function HomeScreen({
  user,
  feed,
  category,
  onCategory,
  onOpenFilters,
  onOpenPost,
  savedIds,
  onToggleSave,
  votedIds,
  onUpvote,
  votes,
  onVote,
  notesRead,
  onOpenNotifications,
  topics,
  onCreateShowdown,
  debateNoun,
  canDebate,
  debateXpRequired,
}) {
  const firstName = getFirstName(user);
  const [notesOpen, setNotesOpen] = useState(false);
  const unread = notesRead ? 0 : NOTIFICATIONS.filter((note) => note.unread).length;
  const debateTitle = debateNoun ? `Got a ${debateNoun} Debate?` : "Got a Debate?";
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
          <button
            className={`icon-btn${unread ? " has-badge" : ""}`}
            type="button"
            aria-label="Notifications"
            onClick={() => {
              onOpenNotifications?.();
              setNotesOpen(true);
            }}
          >
            🔔
            {unread ? <span className="note-dot">{unread}</span> : null}
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

      <div className={`debate-banner${canDebate ? "" : " is-locked"}`}>
        <div>
          <strong>{debateTitle}</strong>
          <p>
            {canDebate
              ? "Let the community decide."
              : `Locked until you reach ${debateXpRequired.toLocaleString()} Gold Coins.`}
          </p>
        </div>
        <button
          className="link-btn"
          type="button"
          onClick={onCreateShowdown}
          disabled={!canDebate}
          title={canDebate ? "Create a showdown" : `Need ${debateXpRequired.toLocaleString()} Gold Coins to debate`}
        >
          {canDebate ? "Create a Showdown" : "🔒 1,000 🪙"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">🎬</div>
          <h2>No community picks for this combo yet!</h2>
          <p>Start the conversation with your own hidden gem.</p>
          <button className="btn-primary" type="button" onClick={onOpenPost}>
            Be the first to recommend one (+25 Gold Coins)
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
                upvoted={votedIds.includes(item.id)}
                onToggleSave={onToggleSave}
                onUpvote={onUpvote}
              />
            )
          )}

          <div className="daily-showdown">
            <p className="eyebrow light">Daily Showdown</p>
            <h3>Which {debateNoun ? debateNoun.toLowerCase() : "pick"} has the more shocking plot twist?</h3>
            <p>Cast your vote to reveal the results</p>
          </div>
        </div>
      )}

      {notesOpen ? <NotificationsDrawer onClose={() => setNotesOpen(false)} /> : null}
    </div>
  );
}

function RecommendationCard({ item, saved, upvoted, onToggleSave, onUpvote }) {
  const displayImage = item.image || item.imageUrl;
  const displayQuote = item.quote || item.caption;
  const displayAuthor = item.author || item.authorName || "Anonymous";
  const displayHandle =
    item.handle ||
    (displayAuthor !== "Anonymous" ? displayAuthor.slice(0, 2).toUpperCase() : "YO");
  const displayRank = item.rank || "Lvl 1 Curator";

  return (
    <article className="card rec-card">
      <div className="rec-top">
        <div className="avatar">{displayHandle}</div>
        <div className="rec-meta">
          <strong>{displayAuthor}</strong>
          <span>{displayRank}</span>
        </div>
        <span className="pill">{labelFor(item.category)}</span>
      </div>
      <h3>{item.title}</h3>
      {displayImage ? <img src={displayImage} alt="" className="rec-image" /> : null}
      {displayQuote ? <p className="quote">“{displayQuote}”</p> : null}
      <div className="rec-actions">
        <button
          type="button"
          className={`vote-btn${upvoted ? " is-voted" : ""}`}
          onClick={() => onUpvote(item.id)}
          aria-label={upvoted ? "Remove upvote" : "Upvote"}
        >
          ↑ {item.upvotes + (upvoted ? 1 : 0)}
        </button>
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
  const revealed = Boolean(vote);
  const leftVotes = (item.left.votes || 0) + (vote === item.left.id ? 1 : 0);
  const rightVotes = (item.right.votes || 0) + (vote === item.right.id ? 1 : 0);
  const totalVotes = leftVotes + rightVotes;

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
          {revealed ? (
            <span className="vote-chip is-count">{leftVotes} votes</span>
          ) : (
            <span className="vote-chip">Vote {item.left.title}</span>
          )}
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
          {revealed ? (
            <span className="vote-chip is-count">{rightVotes} votes</span>
          ) : (
            <span className="vote-chip">Vote {item.right.title}</span>
          )}
        </button>
      </div>
      <div className="rec-actions muted">
        <span>{revealed ? `${totalVotes} votes cast` : "Vote to see the tally"}</span>
      </div>
    </article>
  );
}

function NotificationsDrawer({ onClose }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <aside className="sheet notes-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-head">
          <div>
            <p className="eyebrow">Stay in the loop</p>
            <h2>Notifications</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="notes-list">
          {NOTIFICATIONS.map((note) => (
            <article key={note.id} className="note-row">
              <div>
                <strong>{note.title}</strong>
                <p>{note.body}</p>
              </div>
              <span>{note.time}</span>
            </article>
          ))}
        </div>
      </aside>
    </div>
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
