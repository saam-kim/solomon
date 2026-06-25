import { useEffect, useMemo, useState } from "react";
import { lawPoints } from "../data/lawPoints";
import { endings } from "../data/endings";
import { useGameState } from "../hooks/useGameState";
import { BacklogPanel } from "./BacklogPanel";
import { BackgroundLayer } from "./BackgroundLayer";
import { CharacterLayer } from "./CharacterLayer";
import { ChoicePanel } from "./ChoicePanel";
import { ChoiceResultPanel } from "./ChoiceResultPanel";
import { DialogueBox } from "./DialogueBox";
import { EndingScreen } from "./EndingScreen";
import { LawPointCard } from "./LawPointCard";
import { MemoryFlashback } from "./MemoryFlashback";
import { PropLayer } from "./PropLayer";
import { RecallCard } from "./RecallCard";
import { SaveLoadPanel } from "./SaveLoadPanel";
import { SettingsPanel, type TextSize } from "./SettingsPanel";
import { StatusPanel } from "./StatusPanel";
import { TeacherPanel } from "./TeacherPanel";

export function GameScreen() {
  const game = useGameState();
  const { advance } = game;
  const [openPanel, setOpenPanel] = useState<"log" | "status" | "settings" | "teacher" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [lawCardId, setLawCardId] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [fastMode, setFastMode] = useState(false);
  const [muted, setMuted] = useState(true);
  const [autoMode, setAutoMode] = useState(false);
  const teacherMode = useMemo(() => new URLSearchParams(window.location.search).get("teacher") === "1", []);

  const currentLawPoint = useMemo(() => {
    const id = game.scene.lawPointId;
    return id && game.state.unlockedLawPoints.includes(id) ? lawPoints[id] : undefined;
  }, [game.scene.lawPointId, game.state.unlockedLawPoints]);
  const activeLawPoint = lawCardId ? lawPoints[lawCardId] : undefined;
  const visualLine = game.line ?? (game.showChoices ? game.scene.dialogue.at(-1) : undefined);
  const activeProps = visualLine?.propUpdates ?? game.scene.props;
  const focusedProp = activeProps?.some((prop) => prop.mode === "focus") ?? false;
  const activeCg = focusedProp ? undefined : (visualLine?.cg ?? game.scene.cg);

  const backlogLines = useMemo(() => {
    if (!game.line) return game.state.backlog;
    const lastLine = game.state.backlog.at(-1);
    const alreadyIncluded = lastLine?.speaker === game.line.speaker && lastLine.text === game.line.text;
    return alreadyIncluded ? game.state.backlog : [...game.state.backlog, game.line];
  }, [game.line, game.state.backlog]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        setOpenPanel(null);
        return;
      }
      if (!["Space", "Enter"].includes(event.code) || openPanel || lawCardId || game.lastOutcome || game.pendingRecall) return;
      if (event.code === "Enter" && game.showChoices) return;
      const target = event.target as HTMLElement;
      if (["BUTTON", "INPUT", "TEXTAREA"].includes(target.tagName)) return;
      event.preventDefault();
      advance();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance, game.lastOutcome, game.pendingRecall, game.showChoices, lawCardId, openPanel]);

  useEffect(() => {
    if (!autoMode || openPanel || lawCardId || game.lastOutcome || game.pendingRecall || game.showChoices || game.isDemoComplete) return;
    const timer = window.setTimeout(() => advance(), fastMode ? 850 : 2400);
    return () => window.clearTimeout(timer);
  }, [advance, autoMode, fastMode, game.isDemoComplete, game.lastOutcome, game.pendingRecall, game.showChoices, game.state.currentLineIndex, game.state.currentSceneId, lawCardId, openPanel]);

  const handleSave = () => {
    game.save();
    setNotice("현재 장면을 저장했습니다.");
  };

  const handleLoad = () => setNotice(game.load() ? "저장한 장면을 불러왔습니다." : "저장된 기록이 없습니다.");

  const handleRestart = () => {
    if (window.confirm("현재 진행을 멈추고 처음부터 시작할까요? 저장 데이터는 유지됩니다.")) {
      game.restart();
      setOpenPanel(null);
      setLawCardId(null);
      setNotice("처음부터 다시 시작합니다.");
    }
  };

  const selectedEnding = game.state.selectedEndingId ? endings[game.state.selectedEndingId] : undefined;
  if (game.state.currentSceneId === "ending" && selectedEnding && !game.lastOutcome && !lawCardId) {
    return <EndingScreen ending={selectedEnding} state={game.state} onSave={game.save} onRestart={handleRestart} />;
  }

  return (
    <main className={`game-shell text-${textSize}${fastMode ? " fast-mode" : ""}`} data-muted={muted}>
      <header className="game-header">
        <div>
          <span className="eyebrow">CONVENIENCE SOLOMON</span>
          <h1>편의점 솔로몬 <small>선을 긋는 연습</small></h1>
        </div>
        <div className="scene-title"><span>현재 장면</span><strong key={game.scene.id}>{game.scene.title}</strong></div>
        <SaveLoadPanel message={notice} onSave={handleSave} onLoad={handleLoad} onRestart={handleRestart} />
      </header>

      <section className={`game-stage${game.line?.effect ? ` stage-effect-${game.line.effect}` : ""}`} onClick={() => { if (!openPanel && !lawCardId && !game.lastOutcome && !game.pendingRecall) game.advance(); }}>
        <BackgroundLayer background={visualLine?.background ?? game.scene.background} cg={activeCg} />
        <CharacterLayer placements={(activeCg || focusedProp) ? [] : (visualLine?.characterUpdates ?? game.scene.characters)} />
        <PropLayer placements={activeProps} />
        <div className="stage-vignette" />
        <nav className="stage-tools" onClick={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => setOpenPanel(openPanel === "log" ? null : "log")}>기록</button>
          <button type="button" onClick={() => setOpenPanel(openPanel === "status" ? null : "status")}>상태</button>
          <button type="button" className={autoMode ? "active" : ""} aria-pressed={autoMode} onClick={() => setAutoMode((enabled) => !enabled)}>자동</button>
          {currentLawPoint && <button type="button" onClick={() => setLawCardId(currentLawPoint.id)}>법 노트</button>}
          <button type="button" onClick={() => setOpenPanel(openPanel === "settings" ? null : "settings")}>설정</button>
          {teacherMode && <button type="button" onClick={() => setOpenPanel(openPanel === "teacher" ? null : "teacher")}>TEACHER</button>}
        </nav>

        {game.showChoices && game.scene.choices ? (
          <>
            {game.scene.memoryCount && (
              <MemoryFlashback memories={game.state.choiceHistory.slice(-game.scene.memoryCount)} />
            )}
          <ChoicePanel choices={game.scene.choices} onChoose={game.choose} delayMs={fastMode ? 0 : 500} />
          </>
        ) : (
          <DialogueBox line={game.line} canAdvance={!game.isDemoComplete} complete={game.isDemoComplete} />
        )}

        {openPanel === "log" && <BacklogPanel lines={backlogLines} onClose={() => setOpenPanel(null)} />}
        {openPanel === "status" && <StatusPanel state={game.state} onClose={() => setOpenPanel(null)} />}
        {openPanel === "settings" && (
          <SettingsPanel textSize={textSize} fastMode={fastMode} muted={muted} onTextSize={setTextSize} onFastMode={setFastMode} onMuted={setMuted} onClose={() => setOpenPanel(null)} />
        )}
        {teacherMode && openPanel === "teacher" && (
          <TeacherPanel
            state={game.state}
            onClose={() => setOpenPanel(null)}
            onJump={(sceneId, preserveState) => {
              game.jumpToScene(sceneId, preserveState);
              setLawCardId(null);
              setOpenPanel(null);
            }}
          />
        )}
        {game.lastOutcome && (
          <ChoiceResultPanel
            resultText={game.lastOutcome.resultText}
            resultAsset={game.lastOutcome.resultAsset}
            hasLawPoint={Boolean(game.lastOutcome.lawPointId)}
            emphasis={game.lastOutcome.emphasis}
            characters={game.lastOutcome.characters}
            onContinue={() => {
              const nextLawPointId = game.lastOutcome?.lawPointId;
              game.clearOutcome();
              if (nextLawPointId) setLawCardId(nextLawPointId);
              else game.completeChoiceTransition();
            }}
          />
        )}
        {activeLawPoint && (
          <LawPointCard
            point={activeLawPoint}
            onClose={() => {
              setLawCardId(null);
              if (game.pendingSceneId) game.completeChoiceTransition();
            }}
          />
        )}
        {!game.lastOutcome && !activeLawPoint && game.pendingRecall && (
          <RecallCard recall={game.pendingRecall} onClose={() => game.applyRecall(game.pendingRecall!)} />
        )}
      </section>

      <footer className="game-footer">
        <span>CONVENIENCE SOLOMON · 법교육 비주얼노벨</span>
        <span>{Math.min(game.state.currentLineIndex + 1, game.scene.dialogue.length)} / {game.scene.dialogue.length}</span>
      </footer>
    </main>
  );
}
