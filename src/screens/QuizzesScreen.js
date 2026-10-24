import { useState } from "react";
import { QUIZ_QUESTION, WEEKLY_CHAMPIONS } from "../data";

export default function QuizzesScreen({ user, onOpenLeaderboard, quizXp, onCompleteQuiz }) {
  const [playing, setPlaying] = useState(false);
  const [picked, setPicked] = useState(null);
  const firstName = (user?.displayName || "You").split(" ")[0];

  const submit = () => {
    if (picked === null) return;
    const correct = picked === QUIZ_QUESTION.answer;
    onCompleteQuiz(correct ? QUIZ_QUESTION.xp : 5);
    setPlaying(false);
    setPicked(null);
  };

  return (
    <div className="screen">
      <p className="eyebrow">Play. Learn. Level up.</p>
      <h1>Daily Quizzes</h1>

      <section className="quiz-hero">
        <div>
          <p className="eyebrow light">Daily quick play</p>
          <h2>Today’s Question #{QUIZ_QUESTION.number}</h2>
          <p>
            1 Question · {QUIZ_QUESTION.seconds} seconds · +{QUIZ_QUESTION.xp} Gold Coins
          </p>
          <button type="button" className="btn-light" onClick={() => setPlaying(true)}>
            Play Today’s Question
          </button>
        </div>
        <div className="quiz-badge">{QUIZ_QUESTION.number}</div>
      </section>

      {playing ? (
        <section className="card quiz-play">
          <h3>{QUIZ_QUESTION.prompt}</h3>
          <div className="quiz-options">
            {QUIZ_QUESTION.options.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`quiz-option${picked === index ? " is-picked" : ""}`}
                onClick={() => setPicked(index)}
              >
                {option}
              </button>
            ))}
          </div>
          <button type="button" className="btn-primary" disabled={picked === null} onClick={submit}>
            Submit answer
          </button>
        </section>
      ) : null}

      <div className="stat-row">
        <div className="mini-card">
          <strong>🔥 5 day streak</strong>
          <p>Keep it going, {firstName}!</p>
        </div>
        <div className="mini-card">
          <strong>🪙 {quizXp} Quiz Gold Coins</strong>
          <p>This week</p>
        </div>
      </div>

      <section>
        <h2 className="section-title">Weekly Quiz Champions</h2>
        <div className="card">
          {WEEKLY_CHAMPIONS.map((person, index) => (
            <div key={person.id} className="leader-row">
              <span className="rank">{index + 1}</span>
              <span className="avatar sm">{person.handle}</span>
              <div>
                <strong>{person.name}</strong>
              </div>
              <span className="streak">🔥 {person.days}</span>
            </div>
          ))}
          <button type="button" className="ghost-btn" onClick={onOpenLeaderboard}>
            View Full Leaderboard ›
          </button>
        </div>
      </section>
    </div>
  );
}
