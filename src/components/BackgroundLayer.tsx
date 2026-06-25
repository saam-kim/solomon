import { getBackground, getCg } from "../utils/assetMap";

type Props = { background?: string; cg?: string };

export function BackgroundLayer({ background, cg }: Props) {
  const backgroundSource = background ? getBackground(background) : undefined;
  const cgSource = cg ? getCg(cg) : undefined;

  return (
    <div className="background-layer">
      {backgroundSource ? <img src={backgroundSource} alt="장면 배경" /> : <span>배경 PNG 준비 중 · {background ?? "미지정"}</span>}
      {cg && (cgSource ? <img className="cg-image" src={cgSource} alt="이벤트 장면" /> : <span className="cg-placeholder">CG PNG 준비 중 · {cg}</span>)}
    </div>
  );
}
