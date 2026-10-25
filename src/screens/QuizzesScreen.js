import { useState } from "react";
import AddQuizModal from "./AddQuizModal";
import GoldCoin from "../components/GoldCoin";

export default function QuizzesScreen({
  user,
  onOpenLeaderboard,
  quizXp = 0,
  streak = 0,
  quizzes = [],
  onCompleteQuiz,
  onCreateQuiz,
  leaderboard = [],
}) {
  const [playing, setPlaying] = useState(false);
  const [picked, setPicked] = useState(null);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const firstName = (user?.displayName || "You").split(" ")[0];
  const currentQuiz = quizzes.length > 0 ? quizzes[activeQuizIndex % quizzes.length] : null;

  const submit = () => {
    if (picked === null || !currentQuiz) return;
    const correct = picked === currentQuiz.answer;
    const earnedXp = correct ? (currentQuiz.xp || 15) : 5;
    onCompleteQuiz(earnedXp, correct);
    setFeedback({ correct, earned: earnedXp });
    setPlaying(false);
    setPicked(null);
  };

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p className="eyebrow">Play. Learn. Level up.</p>
          <h1>Daily Quizzes</h1>
        </div>
        <button
          type="button"
          className="btn-light"
          style={{ padding: "8px 12px", fontSize: "12px", fontWeight: "700", borderRadius: "10px", marginTop: "4px" }}
          onClick={() => setCreateOpen(true)}
        >
          + Add Quiz
        </button>
      </div>

      {!currentQuiz ? (
        <section className="quiz-hero" style={{ background: "linear-gradient(135deg, #4f2d7f, #311c5e)" }}>
          <div>
            <p className="eyebrow light">Community trivia</p>
            <h2>No Quizzes Available Yet</h2>
            <p>Quizzes start at zero! Insert the first community quiz question.</p>
            <button type="button" className="btn-light" onClick={() => setCreateOpen(true)}>
              + Create First Quiz (+10 <GoldCoin size={13} />)
            </button>
          </div>
          <div className="quiz-badge">0</div>
        </section>
      ) : (
        <section className="quiz-hero">
          <div>
            <p className="eyebrow light">
              Question #{activeQuizIndex + 1} of {quizzes.length}
            </p>
            <h2>{currentQuiz.prompt}</h2>
            <p>
              1 Question · {currentQuiz.seconds || 30} seconds · +{currentQuiz.xp || 15} Gold Coins
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" }}>
              <button
                type="button"
                className="btn-light"
                onClick={() => {
                  setPlaying(true);
                  setFeedback(null);
                  setPicked(null);
                }}
              >
                Play This Question
              </button>
              {quizzes.length > 1 && (
                <button
                  type="button"
                  className="btn-light"
                  style={{ opacity: 0.85 }}
                  onClick={() => {
                    setActiveQuizIndex((i) => (i + 1) % quizzes.length);
                    setPlaying(false);
                    setFeedback(null);
                    setPicked(null);
                  }}
                >
                  Next Quiz ›
                </button>
              )}
            </div>
          </div>
          <div className="quiz-badge">{activeQuizIndex + 1}</div>
        </section>
      )}

      {playing && currentQuiz ? (
        <section className="card quiz-play">
          <h3>{currentQuiz.prompt}</h3>
          <div className="quiz-options">
            {currentQuiz.options.map((option, index) => (
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

      {feedback ? (
        <section
          className="card"
          style={{
            textAlign: "center",
            padding: "20px 16px",
            background: feedback.correct ? "#ecfdf5" : "#fef2f2",
            borderColor: feedback.correct ? "#a7f3d0" : "#fecaca",
          }}
        >
          <h3 style={{ margin: "0 0 6px", color: feedback.correct ? "#065f46" : "#991b1b" }}>
            {feedback.correct ? "🎉 Correct Answer!" : "Not quite!"}
          </h3>
          <p style={{ margin: "0 0 12px", color: feedback.correct ? "#047857" : "#b91c1c" }}>
            You earned +{feedback.earned} Gold Coins! {feedback.correct ? "Daily streak increased!" : ""}
          </p>
          {quizzes.length > 1 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setActiveQuizIndex((i) => (i + 1) % quizzes.length);
                setFeedback(null);
                setPicked(null);
              }}
            >
              Try Next Quiz Question ›
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={() => setCreateOpen(true)}>
              + Create Another Quiz (+10 <GoldCoin size={13} />)
            </button>
          )}
        </section>
      ) : null}

      <div className="stat-row">
        <div className="mini-card">
          <strong>🔥 {streak} day streak</strong>
          <p>{streak > 0 ? `Keep it going, ${firstName}!` : `Start your daily streak, ${firstName}!`}</p>
        </div>
        <div className="mini-card">
          <strong style={{ display: "inline-flex", alignItems: "center" }}>
            <GoldCoin size={16} /> {quizXp} Quiz Gold Coins
          </strong>
          <p>This week</p>
        </div>
      </div>

      <section>
        <h2 className="section-title">Weekly Quiz Champions</h2>
        <div className="card">
          {leaderboard.length === 0 ? (
            <p className="empty-note" style={{ padding: "16px 12px", textAlign: "center" }}>
              No quiz champions yet. Complete a quiz to claim #1!
            </p>
          ) : (
            leaderboard.slice(0, 5).map((person, index) => (
              <div key={person.id || person.uid || index} className="leader-row">
                <span className="rank">{index + 1}</span>
                <span className="avatar sm">{person.handle}</span>
                <div>
                  <strong>{person.name}</strong>
                </div>
                <span className="streak">🔥 {person.days || `${person.streak || 0} days`}</span>
              </div>
            ))
          )}
          <button type="button" className="ghost-btn" onClick={onOpenLeaderboard}>
            View Full Leaderboard ›
          </button>
        </div>
      </section>

      <AddQuizModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(quizData) => {
          onCreateQuiz?.(quizData);
          setCreateOpen(false);
        }}
      />
    </div>
  );
}
