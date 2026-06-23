import type { CharacterPlacement, DialogueLine } from "../types";
import { assetUrl } from "../utils/assetMap";

type Props = {
  characters?: CharacterPlacement[];
  line: DialogueLine | null;
  mainIllustration: string;
  testimonyShowingSuccess?: boolean;
  success?: {
    npcPose?: string;
    playerPose?: string;
  };
};

export function CharacterLayer({
  characters = [],
  line,
  mainIllustration,
  testimonyShowingSuccess,
  success,
}: Props) {
  const isEventCg = mainIllustration ? (mainIllustration.includes("_CG_") || mainIllustration.startsWith("CG_")) : false;

  if (isEventCg || characters.length === 0) return null;

  return (
    <div className="character-layer" aria-hidden="true">
      {characters.map((character) => {
        const isSpeaking = character.activeFor?.includes(line?.speaker ?? "") ?? false;
        
        let asset = character.asset;
        if (isSpeaking && line?.focus) {
          asset = line.focus;
        } else if (testimonyShowingSuccess && success) {
          if (character.side === "left" && success.playerPose) {
            asset = success.playerPose;
          } else if (character.side === "right" && success.npcPose) {
            asset = success.npcPose;
          }
        }

        return (
          <img
            key={`${character.side}-${character.asset}`}
            className={`character-sprite ${character.side} ${isSpeaking ? "active" : "inactive"}`}
            src={assetUrl(asset)}
            alt=""
          />
        );
      })}
    </div>
  );
}
