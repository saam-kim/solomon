export type TextSize = "small" | "normal" | "large";

export function SettingsPanel({ textSize, fastMode, muted, onTextSize, onFastMode, onMuted, onClose }: {
  textSize: TextSize;
  fastMode: boolean;
  muted: boolean;
  onTextSize: (size: TextSize) => void;
  onFastMode: (enabled: boolean) => void;
  onMuted: (muted: boolean) => void;
  onClose: () => void;
}) {
  return (
    <aside className="side-panel settings-panel" aria-label="접근성 설정">
      <div className="panel-heading"><h2>플레이 설정</h2><button type="button" onClick={onClose} aria-label="설정 닫기">×</button></div>
      <section>
        <h3>글자 크기</h3>
        <div className="segmented-control">
          {(["small", "normal", "large"] as TextSize[]).map((size) => (
            <button key={size} type="button" className={textSize === size ? "active" : ""} onClick={() => onTextSize(size)}>
              {size === "small" ? "작게" : size === "normal" ? "기본" : "크게"}
            </button>
          ))}
        </div>
      </section>
      <label className="toggle-row"><span><strong>빠른 진행</strong><small>선택 전 정적과 전환 효과를 줄입니다.</small></span><input type="checkbox" checked={fastMode} onChange={(event) => onFastMode(event.target.checked)} /></label>
      <label className="toggle-row"><span><strong>음소거</strong><small>오디오 추가를 위한 UI 설정입니다.</small></span><input type="checkbox" checked={muted} onChange={(event) => onMuted(event.target.checked)} /></label>
      <div className="keyboard-help"><h3>키보드</h3><p>Space/Enter 진행 · 숫자 1~5 선택 · Esc 메뉴 닫기</p></div>
    </aside>
  );
}
