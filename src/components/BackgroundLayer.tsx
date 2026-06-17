import { assetUrl } from "../utils/assetMap";

type Props = {
  background?: string;
  mainIllustration: string;
  dim?: boolean;
};

export function BackgroundLayer({ background, mainIllustration, dim }: Props) {
  const isEventCg = mainIllustration.includes("_CG_") || mainIllustration.startsWith("CG_");

  return (
    <div className={`background-layer ${dim ? "is-dimmed" : ""}`}>
      {background && !isEventCg && <img className="background-image secondary" src={assetUrl(background)} alt="" />}
      <img className="background-image primary" src={assetUrl(mainIllustration)} alt="" />
    </div>
  );
}
