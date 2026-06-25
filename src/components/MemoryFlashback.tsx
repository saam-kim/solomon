import type { ChoiceHistoryItem } from "../types/game";

export function MemoryFlashback({ memories }: { memories: ChoiceHistoryItem[] }) {
  if (!memories.length) return null;

  return (
    <aside className="memory-flashback" aria-label="이전 선택 회상">
      <span>지나온 선들</span>
      <div>
        {memories.map((memory) => (
          <blockquote key={`${memory.sceneId}-${memory.choiceId}`}>
            “{memory.choiceLabel.replaceAll("“", "").replaceAll("”", "")}”
          </blockquote>
        ))}
      </div>
    </aside>
  );
}
