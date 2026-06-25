type Props = {
  message: string | null;
  onSave: () => void;
  onLoad: () => void;
  onRestart: () => void;
};

export function SaveLoadPanel({ message, onSave, onLoad, onRestart }: Props) {
  return (
    <div className="save-controls" onClick={(event) => event.stopPropagation()}>
      <button type="button" onClick={onSave}>저장</button>
      <button type="button" onClick={onLoad}>불러오기</button>
      <button type="button" onClick={onRestart}>처음부터</button>
      {message && <span className="save-message" role="status">{message}</span>}
    </div>
  );
}
