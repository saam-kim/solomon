import type { Recall } from "../types/game";
import { getAssetUrl } from "../utils/assetMap";

export function RecallCard({ recall, onClose }: { recall: Recall; onClose: () => void }) {
  const source = recall.assetKey ? getAssetUrl(recall.assetKey) : undefined;

  return (
    <div className="modal-backdrop recall-backdrop" role="presentation" onClick={(event) => event.stopPropagation()}>
      <section className="recall-card" role="dialog" aria-modal="true" aria-labelledby="recall-title">
        <span className="eyebrow">A PAST CHOICE RETURNS</span>
        <h2 id="recall-title">{recall.title}</h2>
        <div className="recall-asset">
          {source ? <img src={source} alt={`${recall.title} 회수 장면`} /> : <span>관련 일러스트 준비 중 · {recall.title}</span>}
        </div>
        <p>{recall.text}</p>
        <button type="button" className="primary-button" onClick={onClose}>이 결과를 받아들인다</button>
      </section>
    </div>
  );
}
