import { useState } from "react";
import { CATEGORY_CHIPS } from "../data";

const CATEGORIES = CATEGORY_CHIPS.filter((chip) => chip.id !== "all");

export default function AddRecommendationModal({ open, onClose, onSubmit }) {
  const [category, setCategory] = useState("movies");
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");

  if (!open) return null;

  const canPost = title.trim().length > 1 && reason.trim().length > 3;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canPost) return;
    onSubmit({ category, title: title.trim(), reason: reason.trim() });
    setTitle("");
    setReason("");
    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form className="sheet add-sheet" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
        <div className="sheet-head">
          <div>
            <p className="eyebrow">Share a favorite</p>
            <h2>Add Recommendation</h2>
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
          Title name
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Third Wave Coffee"
          />
        </label>

        <label>
          Why do you recommend this?
          <textarea
            maxLength={140}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Keep it short and tell us what makes it special"
          />
          <span className="char-count">{reason.length}/140</span>
        </label>

        <button type="button" className="photo-btn">
          📷 Add Photo
        </button>

        <button type="submit" className="btn-primary" disabled={!canPost}>
          Post Recommendation (+15 XP)
        </button>
      </form>
    </div>
  );
}
