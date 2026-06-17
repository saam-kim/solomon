import type { Choice } from "../types";

type Props = {
  choices: Choice[];
  reflectionPrompt: string;
  reflectionValue: string;
  onReflectionChange: (value: string) => void;
  onChoose: (choice: Choice) => void;
};

export function ChoicePanel({ choices, reflectionPrompt, reflectionValue, onReflectionChange, onChoose }: Props) {
  return (
    <div className="choice-panel">
      <section className="decision-note" aria-label="선택 이유 기록">
        <p>{reflectionPrompt}</p>
        <textarea
          value={reflectionValue}
          onChange={(event) => onReflectionChange(event.target.value)}
          placeholder="선택 전에 이유를 짧게 적어보세요."
          rows={2}
        />
      </section>
      {choices.map((choice, index) => (
        <button key={choice.id} className="choice-button" onClick={() => onChoose(choice)}>
          <span className="choice-index">{index + 1}</span>
          <span>{choice.label}</span>
        </button>
      ))}
    </div>
  );
}
