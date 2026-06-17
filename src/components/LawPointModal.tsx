import { X } from "lucide-react";
import type { LawPoint } from "../types";

type Props = {
  point?: LawPoint;
  onClose: () => void;
};

export function LawPointModal({ point, onClose }: Props) {
  if (!point) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="law-title">
      <section className="law-card">
        <div className="law-card-header">
          <span>정리 카드</span>
          <button className="icon-button" onClick={onClose} aria-label="닫기" title="닫기">
            <X size={20} />
          </button>
        </div>
        <h2 id="law-title">{point.title}</h2>
        <p>{point.body}</p>
        <button className="primary-action" onClick={onClose}>
          다음 장면으로
        </button>
      </section>
    </div>
  );
}
