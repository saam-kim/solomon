import { characters as characterProfiles } from "../data/characters";
import type { CharacterPlacement } from "../types/game";
import { getAssetUrl, getCharacterSprite } from "../utils/assetMap";

export function ChoiceResultPanel({ resultText, resultAsset, hasLawPoint, emphasis = false, characters = [], onContinue }: {
  resultText: string;
  resultAsset?: string;
  hasLawPoint: boolean;
  emphasis?: boolean;
  characters?: CharacterPlacement[];
  onContinue: () => void;
}) {
  const resultSource = resultAsset ? getAssetUrl(resultAsset) : undefined;

  return (
    <div className="modal-backdrop result-backdrop" role="presentation" onClick={(event) => event.stopPropagation()}>
      <section className={`choice-result-panel${emphasis ? " emphasized" : ""}`} role="dialog" aria-modal="true" aria-labelledby="choice-result-title">
        <span className="eyebrow">YOUR WORDS LEFT A MARK</span>
        <h2 id="choice-result-title">선택 뒤에 남은 것</h2>
        {resultAsset && (
          <div className="result-visual">
            {resultSource ? <img src={resultSource} alt="선택의 결과 장면" /> : <span>결과 일러스트 준비 중 · {resultAsset}</span>}
          </div>
        )}
        {characters.length > 0 && (
          <div className="result-characters" aria-label="선택 이후 표정">
            {characters.map((placement) => {
              const source = getCharacterSprite(placement.characterId, placement.emotion);
              return source
                ? <img key={placement.characterId} src={source} alt={`${characterProfiles[placement.characterId].name} ${placement.emotion ?? "neutral"}`} />
                : <span key={placement.characterId}>{characterProfiles[placement.characterId].name} PNG 준비 중 · {placement.emotion ?? "neutral"}</span>;
            })}
          </div>
        )}
        <p>{resultText}</p>
        <button type="button" className="primary-button" onClick={onContinue}>{hasLawPoint ? "이 장면을 돌아보기" : "계속하기"}</button>
      </section>
    </div>
  );
}
