import { useState, useRef } from "react";
import { CATEGORY_CHIPS } from "../data";

const CATEGORIES = CATEGORY_CHIPS.filter((chip) => chip.id !== "all");

// Helper to resize/compress images for fast loading and low storage footprint
const processImageFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file (PNG, JPG, WebP, etc.)."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (typeof window === "undefined" || typeof window.Image === "undefined") {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      let finished = false;
      const timer = setTimeout(() => {
        if (!finished) {
          finished = true;
          resolve(dataUrl);
        }
      }, 300);

      img.onerror = () => {
        if (!finished) {
          finished = true;
          clearTimeout(timer);
          resolve(dataUrl);
        }
      };
      img.onload = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        try {
          const maxDim = 1200;
          let { width, height } = img;
          if (!width || !height) {
            resolve(dataUrl);
            return;
          }
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          resolve(compressed);
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
};

export default function AddRecommendationModal({ open, onClose, onSubmit }) {
  const [category, setCategory] = useState("movies");
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const canPost = title.trim().length > 1 && reason.trim().length > 3 && !isProcessing;

  const handleReset = () => {
    setTitle("");
    setReason("");
    setPhoto(null);
    setPhotoName("");
    setUrlInput("");
    setShowUrlInput(false);
    setPhotoError("");
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    handleReset();
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
    handleReset();
    onClose();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setPhotoError("");
      const compressedDataUrl = await processImageFile(file);
      setPhoto(compressedDataUrl);
      setPhotoName(file.name);
      setShowUrlInput(false);
      setUrlInput("");
    } catch (err) {
      setPhotoError(err.message || "Failed to load image");
    } finally {
      setIsProcessing(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setPhotoError("Please enter an image URL.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith("data:image/")) {
      setPhotoError("URL must start with http:// or https://");
      return;
    }
    setPhoto(trimmed);
    setPhotoName("Web image");
    setUrlInput("");
    setShowUrlInput(false);
    setPhotoError("");
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoName("");
    setPhotoError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          data-testid="photo-file-input"
        />

        {photo ? (
          <div className="photo-preview-wrap">
            <img
              src={photo}
              alt="Recommendation preview"
              className="photo-preview-img"
              onError={() =>
                setPhotoError("Image could not be loaded. Please check the URL or pick another image.")
              }
            />
            <button
              type="button"
              className="photo-remove-btn"
              onClick={handleRemovePhoto}
              title="Remove photo"
              aria-label="Remove photo"
            >
              ✕
            </button>
            <div className="photo-preview-bar">
              <span className="photo-attached-text">
                ✓ {photoName ? `Photo: ${photoName.length > 22 ? photoName.slice(0, 20) + "…" : photoName}` : "Photo attached"}
              </span>
              <button
                type="button"
                className="photo-change-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Change photo
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="photo-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing photo…" : "📷 Add Photo"}
            </button>

            <div className="photo-options-row">
              <button
                type="button"
                className="photo-toggle-btn"
                onClick={() => {
                  setShowUrlInput(!showUrlInput);
                  setPhotoError("");
                }}
              >
                {showUrlInput ? "Cancel URL" : "or paste image URL"}
              </button>
            </div>

            {showUrlInput && (
              <div className="photo-url-row">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleUrlSubmit();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-sm"
                  onClick={handleUrlSubmit}
                >
                  Attach
                </button>
              </div>
            )}
          </>
        )}

        {photoError && <p className="photo-error-msg">{photoError}</p>}

        <button type="submit" className="btn-primary" disabled={!canPost}>
          Post Recommendation (+15 Gold Coins)
        </button>
      </form>
    </div>
  );
}
