import { assetUrl } from "../utils/assetMap";

type Props = {
  background?: string;
  mainIllustration: string;
  dim?: boolean;
  zoomClass?: string;
};

export function BackgroundLayer({ background, mainIllustration, dim, zoomClass = "" }: Props) {
  const isEventCg = mainIllustration ? (mainIllustration.includes("_CG_") || mainIllustration.startsWith("CG_")) : false;

  return (
    <div className={`background-layer ${dim ? "is-dimmed" : ""}`}>
      {background && !isEventCg && <img className={`background-image secondary ${zoomClass}`} src={assetUrl(background)} alt="" />}
      <img className={`background-image primary ${zoomClass}`} src={assetUrl(mainIllustration)} alt="" />
    </div>
  );
}
