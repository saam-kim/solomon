import type { DialogueLine } from "../types";

type Props = {
  line: DialogueLine | null;
  onAdvance: () => void;
  textScale: number;
  quickMode: boolean;
  isTestimony?: boolean;
  currentTestimonyIdx?: number;
  testimonyLength?: number;
};

export function DialogueBox({
  line,
  onAdvance,
  textScale,
  quickMode,
  isTestimony = false,
  currentTestimonyIdx = 0,
  testimonyLength = 0,
}: Props) {
  if (!line) {
    return (
      <button className="dialogue-box waiting" onClick={onAdvance}>
        계속
      </button>
    );
  }

  const prefix = isTestimony ? `[진술 ${currentTestimonyIdx + 1}/${testimonyLength}] ` : "";

  return (
    <button className={`dialogue-box ${line.tone ?? "normal"} ${quickMode ? "quick" : ""}`} onClick={onAdvance}>
      <span className="speaker-tag">{line.speaker}</span>
      <span className="dialogue-text" style={{ fontSize: `${textScale}rem` }}>
        {prefix}{line.text}
      </span>
      <span className="advance-hint">{isTestimony ? "" : "클릭 / Space"}</span>
    </button>
  );
}

