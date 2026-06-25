import { useEffect, useState } from "react";
import type { Choice } from "../types/game";

type Props = {
  choices: Choice[];
  onChoose: (choice: Choice) => void;
  delayMs?: number;
};

export function ChoicePanel({ choices, onChoose, delayMs = 500 }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  useEffect(() => {
    if (!ready) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const numberIndex = event.code.startsWith("Digit") || event.code.startsWith("Numpad")
        ? Number(event.code.at(-1)) - 1
        : -1;
      const choiceIndex = event.code === "Enter" ? 0 : numberIndex;
      if (choiceIndex < 0 || choiceIndex >= choices.length) return;
      event.preventDefault();
      onChoose(choices[choiceIndex]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choices, onChoose, ready]);

  return (
    <section className={`choice-panel${ready ? " ready" : " waiting"}`} aria-label="선택지" aria-busy={!ready}>
      <p className="choice-prompt">{ready ? "지후는 어떻게 말할까?" : "잠시, 숨을 고른다…"}</p>
      {ready && choices.map((choice, index) => (
        <button key={choice.id} type="button" onClick={(event) => { event.stopPropagation(); onChoose(choice); }}>
          <span className="choice-number">{String(index + 1).padStart(2, "0")}</span>
          <span>{choice.label}</span>
        </button>
      ))}
    </section>
  );
}
