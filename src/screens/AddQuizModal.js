import { useState } from "react";
import { CATEGORY_CHIPS } from "../data";
import GoldCoin from "../components/GoldCoin";

const CATEGORIES = CATEGORY_CHIPS.filter((chip) => chip.id !== "all");

export default function AddQuizModal({ open, onClose, onSubmit }) {
  const [category, setCategory] = useState("movies");
  const [prompt, setPrompt] = useState("");
  const [option0, setOption0] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [answer, setAnswer] = useState(0);

  if (!open) return null;

  const options = [option0.trim(), option1.trim(), option2.trim(), option3.trim()];
  const canPost = prompt.trim().length > 3 && options.every((opt) => opt.length > 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canPost) return;
    onSubmit({
      prompt: prompt.trim(),
      category,
      options,
      answer: Number(answer),
      xp: 15,
      seconds: 30,
    });
    setPrompt("");
    setOption0("");
    setOption1("");
    setOption2("");
    setOption3("");
    setAnswer(0);
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form className="sheet add-sheet" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
        <div className="sheet-head">
          <div>
            <p className="eyebrow">Challenge the community</p>
            <h2>Create a Quiz</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {CATEGORIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.icon} {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Question prompt
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="e.g. Which movie had the highest box office in 2023?"
            rows={2}
          />
        </label>

        <label>
          Option 1 (A)
          <input
            value={option0}
            onChange={(event) => setOption0(event.target.value)}
            placeholder="Option A"
          />
        </label>

        <label>
          Option 2 (B)
          <input
            value={option1}
            onChange={(event) => setOption1(event.target.value)}
            placeholder="Option B"
          />
        </label>

        <label>
          Option 3 (C)
          <input
            value={option2}
            onChange={(event) => setOption2(event.target.value)}
            placeholder="Option C"
          />
        </label>

        <label>
          Option 4 (D)
          <input
            value={option3}
            onChange={(event) => setOption3(event.target.value)}
            placeholder="Option D"
          />
        </label>

        <label>
          Correct answer
          <select value={answer} onChange={(event) => setAnswer(event.target.value)}>
            <option value={0}>Option 1 (A)</option>
            <option value={1}>Option 2 (B)</option>
            <option value={2}>Option 3 (C)</option>
            <option value={3}>Option 4 (D)</option>
          </select>
        </label>

        <button type="submit" className="btn-primary" disabled={!canPost}>
          Post Quiz (+10 <GoldCoin size={14} /> Gold Coins)
        </button>
      </form>
    </div>
  );
}
