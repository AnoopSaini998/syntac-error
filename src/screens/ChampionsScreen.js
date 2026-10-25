import { useState } from "react";
import GoldCoin from "../components/GoldCoin";

export default function ChampionsScreen({ user, quizXp = 0, streak = 0, leaderboard = [] }) {
  const initials = getInitials(user);
  const [range, setRange] = useState("week");

  const players = range === "week"
    ? leaderboard
    : leaderboard.map((person) => ({
        ...person,
        xp: person.xp + 50,
      }));

  const userRankIndex = players.findIndex((p) => p.uid === user?.uid);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : null;

  const podium = players.slice(0, 3);
  const topPlayers = players.slice(3, 10);

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

      {players.length === 0 ? (
        <div className="card empty-card" style={{ textAlign: "center", padding: "32px 16px", margin: "16px 0" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🏆</div>
          <h3 style={{ margin: "0 0 6px" }}>Leaderboard starts at zero</h3>
          <p className="muted" style={{ margin: 0, fontSize: "14px" }}>
            No champions yet this week. Play daily quizzes to earn coins, build your streak, and top the leaderboard!
          </p>
        </div>
      ) : (
        <>
          <div className="podium">
            {podium[1] && <PodiumPlace place={2} person={podium[1]} />}
            {podium[0] && <PodiumPlace place={1} person={podium[0]} featured />}
            {podium[2] && <PodiumPlace place={3} person={podium[2]} />}
          </div>

          {topPlayers.length > 0 && (
            <section className="card leaderboard-card">
              <div className="section-row">
                <h2>Top Players</h2>
                <span className="muted">Quiz Gold Coins</span>
              </div>
              {topPlayers.map((person, idx) => (
                <div key={person.id || person.uid || idx} className="leader-row">
                  <span className="rank">#{idx + 4}</span>
                  <span className={`avatar sm leader-avatar rank-${idx + 4}`}>{person.handle}</span>
                  <div>
                    <strong>{person.name}</strong>
                    <p>{person.days || `${person.streak || 0} days`}</p>
                  </div>
                  <strong className="xp-pill"><GoldCoin size={13} /> {person.xp}</strong>
                </div>
              ))}
            </section>
          )}
        </>
      )}

      <div className="your-rank">
        <div>
          <p className="eyebrow light">
            {userRank ? `Your Rank: #${userRank}` : "Your Rank: Unranked"}
          </p>
          <strong>
            {initials} · {streak}-Day Streak
          </strong>
        </div>
        <div className="rank-meta">
          <span>{quizXp > 0 ? "Active contributor" : "Play a quiz to rank"}</span>
          <strong style={{ display: "inline-flex", alignItems: "center" }}><GoldCoin size={16} /> {quizXp}</strong>
        </div>
      </div>
    </div>
  );
}

function PodiumPlace({ place, person, featured }) {
  if (!person) return null;
  return (
    <div className={`podium-place place-${place}${featured ? " featured" : ""}`}>
      <div className={`avatar ${featured ? "lg gold" : "md"} podium-avatar`}>{person.handle}</div>
      {featured ? <span className="crown">👑</span> : null}
      <strong>{person.name}</strong>
      <p>
        🔥 {person.streak || 0}-day streak
        <br />
        <span style={{ display: "inline-flex", alignItems: "center", marginTop: "2px" }}><GoldCoin size={14} /> {person.xp}</span>
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
