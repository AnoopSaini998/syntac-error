import { useRef, useState } from "react";
import { CATEGORY_CHIPS } from "../data";
import GoldCoin from "../components/GoldCoin";

const CATEGORIES = CATEGORY_CHIPS.filter((chip) => chip.id !== "all");

export default function AddRecommendationModal({ open, onClose, onSubmit }) {
  const [category, setCategory] = useState("movies");
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const canPost = title.trim().length > 1 && reason.trim().length > 3;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    setTitle("");
    setReason("");
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canPost) return;
    onSubmit({
      category,
      title: title.trim(),
      reason: reason.trim(),
      image: photo || null,
    });
    handleClose();
  };

  return (
    <div className="sheet-backdrop" onClick={handleClose}>
      <form className="sheet add-sheet" onClick={(event) => event.stopPropagation()} onSubmit={handleSubmit}>
        <div className="sheet-head">
          <div>
            <p className="eyebrow">Share a favorite</p>
            <h2>Add Recommendation</h2>
          </div>
          <button type="button" className="icon-btn" onClick={handleClose} aria-label="Close">
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {photo ? (
          <div className="photo-preview-box">
            <img src={photo} alt="Upload preview" className="photo-preview-img" />
            <button type="button" className="photo-remove-btn" onClick={handleRemovePhoto}>
              ✕ Remove Photo
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="photo-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            📷 Add Photo (Optional)
          </button>
        )}

        <button type="submit" className="btn-primary" disabled={!canPost}>
          Post Recommendation (+15 <GoldCoin size={14} /> Gold Coins)
        </button>
      </form>
    </div>
  );
}
