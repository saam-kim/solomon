import type { DialogueLine } from "../types";

type Props = {
  line: DialogueLine | null;
  onAdvance: () => void;
  textScale: number;
  quickMode: boolean;
};

export function DialogueBox({ line, onAdvance, textScale, quickMode }: Props) {
  if (!line) {
    return (
      <button className="dialogue-box waiting" onClick={onAdvance}>
        계속
      </button>
    );
  }

  return (
    <button className={`dialogue-box ${line.tone ?? "normal"} ${quickMode ? "quick" : ""}`} onClick={onAdvance}>
      <span className="speaker-tag">{line.speaker}</span>
      <span className="dialogue-text" style={{ fontSize: `${textScale}rem` }}>
        {line.text}
      </span>
      <span className="advance-hint">클릭 / Space</span>
    </button>
  );
}
