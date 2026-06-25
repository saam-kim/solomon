import { characters } from "../data/characters";
import type { DialogueLine } from "../types/game";

export function BacklogPanel({ lines, onClose }: { lines: DialogueLine[]; onClose: () => void }) {
  return (
    <aside className="side-panel backlog-panel" aria-label="대사 로그">
      <div className="panel-heading"><h2>대사 로그</h2><button type="button" onClick={onClose} aria-label="닫기">×</button></div>
      {lines.length ? lines.map((line, index) => (
        <div className="log-line" key={`${index}-${line.text}`}><strong>{characters[line.speaker].name}</strong><p>{line.text}</p></div>
      )) : <p className="muted">진행한 대사가 여기에 쌓입니다.</p>}
    </aside>
  );
}
