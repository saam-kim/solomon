import { FastForward, List, Volume2, VolumeX } from "lucide-react";
import type { DialogueLine, GameState, Scene } from "../types";

type Props = {
  state: GameState;
  scene: Scene;
  lines: DialogueLine[];
  onTextScale: (value: number) => void;
  onQuickMode: () => void;
  onMuted: () => void;
};

export function StatusPanel({ state, scene, lines, onTextScale, onQuickMode, onMuted }: Props) {
  const progress = Math.min(100, Math.round(((state.visitedScenes.length - 1) / 11) * 100));
  const recentLines = lines.slice(Math.max(0, state.lineIndex - 4), state.lineIndex + 1);

  return (
    <aside className="status-panel">
      <div>
        <span className="panel-label">진행률</span>
        <div className="progress-track" aria-label={`진행률 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="control-row">
        <label>
          글자
          <input
            type="range"
            min="0.92"
            max="1.25"
            step="0.01"
            value={state.textScale}
            onChange={(event) => onTextScale(Number(event.target.value))}
          />
        </label>
        <button className={`icon-button ${state.quickMode ? "selected" : ""}`} onClick={onQuickMode} title="빠른 진행">
          <FastForward size={18} />
        </button>
        <button className="icon-button" onClick={onMuted} title={state.muted ? "음소거 해제" : "음소거"}>
          {state.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <details className="log-view">
        <summary>
          <List size={16} />
          다시보기 로그
        </summary>
        <div className="log-lines">
          {recentLines.map((line, index) => (
            <p key={`${scene.id}-${index}`}>
              <b>{line.speaker}</b> {line.text}
            </p>
          ))}
        </div>
      </details>
    </aside>
  );
}
