import { useEffect } from "react";
import { lawPoints } from "../data/lawPoints";
import { studentPromptForScene } from "../data/studentPrompts";
import { useGameState } from "../hooks/useGameState";
import { BackgroundLayer } from "./BackgroundLayer";
import { CharacterLayer } from "./CharacterLayer";
import { ChoicePanel } from "./ChoicePanel";
import { DialogueBox } from "./DialogueBox";
import { EndingScreen } from "./EndingScreen";
import { LawPointModal } from "./LawPointModal";
import { PropLayer } from "./PropLayer";
import { SaveLoadPanel } from "./SaveLoadPanel";
import { StatusPanel } from "./StatusPanel";

export function GameScreen() {
  const game = useGameState();
  const { state, scene, currentLine, canShowChoices, choices } = game;
  const pendingLawPoint = lawPoints.find((point) => point.id === state.pendingLawPointId);
  const reflectionPrompt = studentPromptForScene(state.currentSceneId);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!canShowChoices && !state.pendingLawPointId) game.advance();
      }
      if (event.code === "Digit1" && canShowChoices && choices[0]) game.choose(choices[0]);
      if (event.code === "Digit2" && canShowChoices && choices[1]) game.choose(choices[1]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canShowChoices, choices, game, state.pendingLawPointId]);

  if (state.currentSceneId === "ending") {
    return <EndingScreen state={state} onReset={game.reset} />;
  }

  return (
    <main className="game-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">편의점 솔로몬</p>
          <h1>{scene.title}</h1>
        </div>
        <SaveLoadPanel onSave={game.save} onLoad={game.load} onReset={game.reset} />
      </header>

      <section className="stage" aria-label="게임 장면">
        <BackgroundLayer background={scene.background} mainIllustration={scene.mainIllustration} dim={currentLine?.dim} />
        <CharacterLayer characters={scene.characters} line={currentLine} mainIllustration={scene.mainIllustration} />
        <PropLayer props={scene.props} line={currentLine} />
        {canShowChoices && (
          <ChoicePanel
            choices={choices}
            reflectionPrompt={reflectionPrompt}
            reflectionValue={state.reflections[scene.id] ?? ""}
            onReflectionChange={(value) => game.setReflection(scene.id, value)}
            onChoose={game.choose}
          />
        )}
        {!canShowChoices && (
          <DialogueBox
            line={currentLine}
            onAdvance={game.advance}
            textScale={state.textScale}
            quickMode={state.quickMode}
          />
        )}
      </section>

      <div className="lower-panels">
        <StatusPanel
          state={state}
          scene={scene}
          lines={game.lines}
          onTextScale={game.setTextScale}
          onQuickMode={game.toggleQuickMode}
          onMuted={game.toggleMuted}
        />
      </div>

      <LawPointModal point={pendingLawPoint} onClose={game.closeLawPoint} />
    </main>
  );
}
