import { useEffect, useState } from "react";
import { FILTER_GROUPS } from "../data";

export default function FilterSheet({ open, selected, onClose, onApply }) {
  const [draft, setDraft] = useState(selected);

  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  if (!open) return null;

  const toggle = (topic) => {
    setDraft((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic]
    );
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-head">
          <div>
            <p className="eyebrow">Personalize your feed</p>
            <h2>Filter Topics</h2>
          </div>
          <div className="sheet-actions">
            <button type="button" className="text-danger" onClick={() => setDraft([])}>
              Reset
            </button>
            <button type="button" className="text-link" onClick={() => onApply(draft)}>
              Apply
            </button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        </div>

        {FILTER_GROUPS.map((group) => (
          <section key={group.id} className="filter-group">
            <h3>{group.label}</h3>
            <div className="chip-wrap">
              {group.topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className={`chip${draft.includes(topic) ? " is-active" : ""}`}
                  onClick={() => toggle(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>
        ))}

        <div className="sheet-footer">
          <p>
            {draft.length
              ? `${draft.length} topic${draft.length === 1 ? "" : "s"} selected`
              : "Showing recommendations from all topics"}
          </p>
          <button type="button" className="btn-primary" onClick={() => onApply(draft)}>
            Show Matching Recommendations
          </button>
        </div>
      </div>
    </div>
  );
}
