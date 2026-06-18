import { X, Scale } from "lucide-react";
import { lawPoints } from "../data/lawPoints";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  unlockedLaws: string[];
  isTestimonyScene: boolean;
  onPresentLaw: (lawId: string) => void;
};

export function LawbookModal({ isOpen, onClose, unlockedLaws, isTestimonyScene, onPresentLaw }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop active" id="lawbook-modal" onClick={onClose}>
      <div className="modal-content lawbook" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>
            <Scale size={20} className="header-icon" />
            법전 도감
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </header>
        
        <div className="modal-body" id="lawbook-list">
          {lawPoints.map((law) => {
            const isUnlocked = unlockedLaws.includes(law.id);
            if (isUnlocked) {
              return (
                <div key={law.id} className="law-card">
                  <div className="law-card-title">
                    <Scale size={16} style={{ marginRight: "6px" }} />
                    {law.title}
                  </div>
                  <div className="law-card-desc">{law.desc || law.body}</div>
                  {law.penalty && <div className="law-card-penalty">{law.penalty}</div>}
                  {isTestimonyScene && (
                    <button
                      className="present-law-btn"
                      onClick={() => {
                        onPresentLaw(law.id);
                        onClose();
                      }}
                    >
                      이 법령 제시하기
                    </button>
                  )}
                </div>
              );
            } else {
              return (
                <div key={law.id} className="law-card locked">
                  🔒 미해금 법령 (시뮬레이션을 진행하면서 해금하세요)
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
