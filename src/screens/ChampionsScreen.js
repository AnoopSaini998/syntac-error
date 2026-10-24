import { useState } from "react";
import { TOP_PLAYERS, WEEKLY_CHAMPIONS } from "../data";

export default function ChampionsScreen({ user, quizXp }) {
  const initials = getInitials(user);
  const [range, setRange] = useState("week");
  const podium = range === "week" ? WEEKLY_CHAMPIONS : WEEKLY_CHAMPIONS.map((person) => ({
    ...person,
    xp: person.xp + 900,
    streak: person.streak + 20,
  }));

  return (
    <div className="screen">
      <p className="eyebrow">Daily quiz leaderboard</p>
      <h1>
        Quiz Champions <span>🏆</span>
      </h1>

      <div className="segment">
        <button type="button" className={range === "week" ? "is-active" : ""} onClick={() => setRange("week")}>
          This Week
        </button>
        <button type="button" className={range === "all" ? "is-active" : ""} onClick={() => setRange("all")}>
          All Time
        </button>
      </div>

      <div className="podium">
        <PodiumPlace place={2} person={podium[1]} />
        <PodiumPlace place={1} person={podium[0]} featured />
        <PodiumPlace place={3} person={podium[2]} />
      </div>

      <section className="card leaderboard-card">
        <div className="section-row">
          <h2>Top 10 players</h2>
          <span className="muted">Quiz Gold Coins</span>
        </div>
        {TOP_PLAYERS.map((person) => (
          <div key={person.rank} className="leader-row">
            <span className="rank">#{person.rank}</span>
            <span className={`avatar sm leader-avatar rank-${person.rank}`}>{person.handle}</span>
            <div>
              <strong>{person.name}</strong>
              <p>{person.days}</p>
            </div>
            <strong className="xp-pill">🪙 {person.xp}</strong>
          </div>
        ))}
      </section>

      <div className="your-rank">
        <div>
          <p className="eyebrow light">Your Rank: #14</p>
          <strong>
            {initials} · 5-Day Streak
          </strong>
        </div>
        <div className="rank-meta">
          <span>Top 15% this week</span>
          <strong>🪙 {quizXp}</strong>
        </div>
      </div>
    </div>
  );
}

function PodiumPlace({ place, person, featured }) {
  return (
    <div className={`podium-place place-${place}${featured ? " featured" : ""}`}>
      <div className={`avatar ${featured ? "lg gold" : "md"} podium-avatar`}>{person.handle}</div>
      {featured ? <span className="crown">👑</span> : null}
      <strong>{person.name}</strong>
      <p>
        🔥 {person.streak}-day streak
        <br />
        🪙 {person.xp}
      </p>
      <div className="stand">{place}</div>
    </div>
  );
}

function getInitials(user) {
  const name = user?.displayName || user?.email || "YO";
  const parts = name.replace(/@.*/, "").split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
