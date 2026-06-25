import { characters } from "../data/characters";
import type { DialogueLine } from "../types/game";

type Props = {
  line?: DialogueLine;
  canAdvance: boolean;
  complete: boolean;
};

export function DialogueBox({ line, canAdvance, complete }: Props) {
  if (!line) return null;

  return (
    <section className={`dialogue-box effect-${line.effect ?? "none"}`} aria-live="polite">
      <div className="nameplate">{characters[line.speaker].name}</div>
      <p>{line.text}</p>
      {canAdvance && <span className="advance-hint">클릭 / Space <span aria-hidden="true">›</span></span>}
      {complete && <span className="advance-hint complete">DEMO COMPLETE</span>}
    </section>
  );
}
