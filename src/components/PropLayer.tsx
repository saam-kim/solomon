import type { PropPlacement } from "../types";
import { assetUrl } from "../utils/assetMap";
import type { DialogueLine } from "../types";

type Props = {
  props?: PropPlacement[];
  line: DialogueLine | null;
};

export function PropLayer({ props = [], line }: Props) {
  const focusedProps = line?.propFocus
    ? Array.isArray(line.propFocus)
      ? line.propFocus
      : [line.propFocus]
    : [];
  const visibleProps = props.filter((prop) => focusedProps.includes(prop.asset));

  if (visibleProps.length === 0) return null;

  return (
    <div className="prop-layer" aria-hidden="true">
      {visibleProps.map((prop) => (
        <img
          key={`${prop.side}-${prop.asset}`}
          className={`prop-sprite ${prop.side} ${prop.size ?? "medium"} ${prop.closeup ? "closeup" : ""}`}
          src={assetUrl(prop.asset)}
          alt=""
        />
      ))}
    </div>
  );
}
