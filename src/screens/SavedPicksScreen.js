import { useState } from "react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "movies", label: "🎬 Movies" },
  { id: "places", label: "📍 Places" },
  { id: "resources", label: "📚 Books" },
];

export default function SavedPicksScreen({ items, onBack, onUnsave, onMarkWatched, watchedIds }) {
  const [tab, setTab] = useState("saved");
  const [filter, setFilter] = useState("all");

  const source =
    tab === "saved"
      ? items.filter((item) => !watchedIds.includes(item.id))
      : items.filter((item) => watchedIds.includes(item.id));

  const visible =
    filter === "all" ? source : source.filter((item) => item.category === filter);

  const counts = {
    all: source.length,
    movies: source.filter((item) => item.category === "movies").length,
    places: source.filter((item) => item.category === "places").length,
    resources: source.filter((item) => item.category === "resources").length,
  };

  return (
    <div className="screen overlay-screen">
      <header className="subhead">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
        <div>
          <p className="eyebrow">Your collection</p>
          <h1>
            My Saved Picks <span className="count-pill">{items.length} saved</span>
          </h1>
        </div>
      </header>

      <div className="tabs">
        <button type="button" className={tab === "saved" ? "is-active" : ""} onClick={() => setTab("saved")}>
          Saved
        </button>
        <button
          type="button"
          className={tab === "watched" ? "is-active" : ""}
          onClick={() => setTab("watched")}
        >
          Already Watched
        </button>
      </div>

      <div className="chip-row">
        {FILTERS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`chip${filter === chip.id ? " is-active" : ""}`}
            onClick={() => setFilter(chip.id)}
          >
            {chip.label} ({counts[chip.id] || 0})
          </button>
        ))}
      </div>

      <div className="saved-list">
        {visible.map((item) => (
          <article key={item.id} className="saved-row">
            <img src={item.image} alt="" />
            <div>
              <span className="tiny">{labelFor(item.category)}</span>
              <strong>{item.title}</strong>
              <p>Recommended by {item.recommendedBy || item.author}</p>
            </div>
            <div className="saved-actions">
              <button type="button" onClick={() => onUnsave(item.id)} aria-label="Remove">
                🗑
              </button>
              <button type="button" className="check" onClick={() => onMarkWatched(item.id)} aria-label="Mark watched">
                {watchedIds.includes(item.id) ? "✓" : ""}
              </button>
            </div>
          </article>
        ))}
        {visible.length === 0 ? <p className="empty-note">Nothing here yet.</p> : null}
      </div>
    </div>
  );
}

function labelFor(category) {
  const map = {
    movies: "🎬 Movie",
    places: "📍 Place",
    resources: "📚 Resource",
    songs: "🎵 Song",
    sports: "🏆 Sport",
    finance: "💰 Finance",
  };
  return map[category] || category;
}
