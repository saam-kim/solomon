import { characters } from "../data/characters";
import type { CharacterPlacement } from "../types/game";
import { getCharacterAsset } from "../utils/assetMap";

export function CharacterLayer({ placements = [] }: { placements?: CharacterPlacement[] }) {
  return (
    <div className="character-layer" aria-label="등장인물">
      {placements.filter((item) => item.visible !== false).map((item) => {
        const source = getCharacterAsset(item.characterId, item.emotion);
        return (
          <div className={`character-slot ${item.position}`} key={`${item.characterId}-${item.position}`}>
            {source ? (
              <img src={source} alt={`${characters[item.characterId].name} ${item.emotion ?? "neutral"}`} />
            ) : (
              <div className="asset-placeholder">
                <strong>{characters[item.characterId].name}</strong>
                <span>PNG 준비 중 · {item.emotion ?? "neutral"}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
