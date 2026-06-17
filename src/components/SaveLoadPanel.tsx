import { RotateCcw, Save, Upload } from "lucide-react";

type Props = {
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
};

export function SaveLoadPanel({ onSave, onLoad, onReset }: Props) {
  return (
    <div className="save-load-panel">
      <button className="icon-button labeled" onClick={onSave} title="저장">
        <Save size={18} />
        <span>저장</span>
      </button>
      <button className="icon-button labeled" onClick={onLoad} title="불러오기">
        <Upload size={18} />
        <span>불러오기</span>
      </button>
      <button className="icon-button labeled" onClick={onReset} title="처음부터">
        <RotateCcw size={18} />
        <span>처음부터</span>
      </button>
    </div>
  );
}
