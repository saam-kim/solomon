import type { CharacterPlacement, DialogueLine } from "../types";
import { assetUrl } from "../utils/assetMap";

type Props = {
  characters?: CharacterPlacement[];
  line: DialogueLine | null;
  mainIllustration: string;
};

export function CharacterLayer({ characters = [], line, mainIllustration }: Props) {
  const isEventCg = mainIllustration.includes("_CG_") || mainIllustration.startsWith("CG_");
  const activeCharacters = characters.filter((character) => character.activeFor?.includes(line?.speaker ?? ""));

  if (isEventCg || activeCharacters.length === 0) return null;

  return (
    <div className="character-layer" aria-hidden="true">
      {activeCharacters.map((character) => {
        const asset = line?.focus ?? character.asset;
        return (
          <img
            key={`${character.side}-${character.asset}`}
            className={`character-sprite ${character.side} active`}
            src={assetUrl(asset)}
            alt=""
          />
        );
      })}
    </div>
  );
}
