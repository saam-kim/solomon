import type { LawPoint } from "../types/game";

export function LawPointCard({ point, resultText, onClose }: { point: LawPoint; resultText?: string | null; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={(event) => event.stopPropagation()}>
      <section className="law-card" role="dialog" aria-modal="true" aria-labelledby="law-card-title">
        <span className="eyebrow">SCENE REFLECTION</span>
        <h2 id="law-card-title">{point.title}</h2>
        {resultText && <p className="choice-result">{resultText}</p>}
        <p>{point.summary}</p>
        <ul>{point.keyConcepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
        <blockquote>{point.reflectionQuestion}</blockquote>
        <button type="button" className="primary-button" onClick={onClose}>이야기 계속하기</button>
      </section>
    </div>
  );
}
