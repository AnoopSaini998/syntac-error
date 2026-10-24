import { useState } from "react";

export default function ShowdownModal({ open, onClose, onSubmit, debateNoun }) {
  const [question, setQuestion] = useState("");
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  if (!open) return null;

  const canPost = question.trim() && left.trim() && right.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canPost) return;
    onSubmit({
      question: question.trim(),
      left: left.trim(),
      right: right.trim(),
    });
    setQuestion("");
    setLeft("");
    setRight("");
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form className="sheet add-sheet" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
        <div className="sheet-head">
          <div>
            <p className="eyebrow">Let the community decide</p>
            <h2>Create a Showdown</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <label>
          Debate question
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={`Which ${debateNoun ? debateNoun.toLowerCase() : "pick"} had the most unhinged plot twist?`}
          />
        </label>
        <label>
          Option A
          <input value={left} onChange={(event) => setLeft(event.target.value)} placeholder="Fight Club" />
        </label>
        <label>
          Option B
          <input value={right} onChange={(event) => setRight(event.target.value)} placeholder="Memento" />
        </label>

        <button type="submit" className="btn-primary" disabled={!canPost}>
          Post Showdown (+10 Gold Coins)
        </button>
      </form>
    </div>
  );
}
