import { useState } from "react";
import type { PropPlacement } from "../types/game";
import { getProp } from "../utils/assetMap";

export function PropLayer({ placements = [] }: { placements?: PropPlacement[] }) {
  const [focusedPropId, setFocusedPropId] = useState<string | null>(null);
  const focusedSource = focusedPropId ? getProp(focusedPropId) : undefined;
  const hasFocus = placements.some((item) => item.mode === "focus");

  return (
    <>
      <div className={`prop-layer${hasFocus ? " has-focus" : ""}`} aria-label="소품">
        {placements.map((item) => {
          const source = getProp(item.propId);
          const content = source ? <img src={source} alt={item.propId} /> : <span>소품 PNG 준비 중 · {item.propId}</span>;
          return (
            <div className={`prop-slot ${item.position ?? "center"} ${item.mode ?? "inline"}`} key={item.propId}>
              {item.mode === "focus" ? (
                <button type="button" onClick={(event) => { event.stopPropagation(); setFocusedPropId(item.propId); }} aria-label={`${item.propId} 크게 보기`}>
                  {content}
                </button>
              ) : content}
            </div>
          );
        })}
      </div>
      {focusedPropId && (
        <div className="prop-modal" role="presentation" onClick={(event) => { event.stopPropagation(); setFocusedPropId(null); }}>
          <section role="dialog" aria-modal="true" aria-label="소품 클로즈업" onClick={(event) => event.stopPropagation()}>
            {focusedSource ? <img src={focusedSource} alt={focusedPropId} /> : <p>소품 PNG 준비 중 · {focusedPropId}</p>}
            <button type="button" onClick={() => setFocusedPropId(null)}>닫기</button>
          </section>
        </div>
      )}
    </>
  );
}
