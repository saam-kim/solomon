import type { CharacterId, Emotion } from "../types/game";

const modules = import.meta.glob("../assets/illustrations/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byFileName = new Map<string, string>();
const byStem = new Map<string, string>();

Object.entries(modules).forEach(([path, url]) => {
  const fileName = path.split("/").at(-1);
  if (!fileName) return;
  byFileName.set(fileName.toLocaleLowerCase(), url);
  byStem.set(fileName.replace(/\.[^.]+$/, "").toLocaleLowerCase(), url);
});

export const getAssetUrl = (fileName: string): string | undefined => {
  const normalized = fileName.split(/[\\/]/).at(-1)?.toLocaleLowerCase();
  if (!normalized) return undefined;
  return byFileName.get(normalized) ?? byStem.get(normalized.replace(/\.[^.]+$/, ""));
};

export const characterSpriteMap: Partial<Record<CharacterId, Partial<Record<Emotion, string>>>> = {
  jihu: {
    neutral: "01_Jihu_Neutral.png",
    happy: "02_Jihu_Happy.png",
    worried: "03_Jihu_Worried.png",
    determined: "04_Jihu_Determined.png",
    scared: "05_Jihu_Scared.png",
  },
  owner: {
    neutral: "06_Owner_Neutral.png",
    happy: "07_Owner_Happy.png",
    worried: "08_Owner_Worried.png",
    angry: "09_Owner_Angry.png",
  },
  sujin: {
    neutral: "10_Sujin_Neutral.png",
    happy: "11_Sujin_Happy.png",
    sad: "12_Sujin_Sad.png",
    embarrassed: "73_Sujin_Embarrassed_Transparent.png",
    pouting: "74_Sujin_Pouting_Transparent.png",
    angry: "75_Sujin_Angry_Transparent.png",
  },
  youth: {
    sly: "13_Youth_Sly.png",
    worried: "14_Youth_Worried.png",
    scared: "15_Youth_Scared.png",
  },
  child: {
    neutral: "16_Child_Neutral.png",
    happy: "17_Child_Happy.png",
    scared: "18_Child_Scared.png",
  },
  officeWorker: {
    neutral: "19_OfficeWorker_Neutral.png",
    angry: "20_OfficeWorker_Angry.png",
    happy: "21_OfficeWorker_Happy.png",
  },
  elder: {
    neutral: "22_Elder_Neutral.png",
    worried: "23_Elder_Worried.png",
  },
  cat: {
    neutral: "24_Cat_Neutral.png",
    scared: "25_Cat_Scared.png",
  },
  customer: {
    neutral: "76_Customer_Neutral_Transparent.png",
  },
};

const defaultEmotion: Partial<Record<CharacterId, Emotion>> = {
  jihu: "neutral",
  owner: "neutral",
  sujin: "neutral",
  youth: "worried",
  child: "neutral",
  officeWorker: "neutral",
  elder: "neutral",
  cat: "neutral",
  customer: "neutral",
};

const semanticFallbacks: Partial<Record<CharacterId, Partial<Record<Emotion, Emotion>>>> = {
  jihu: { angry: "determined", sad: "worried", embarrassed: "worried", pouting: "worried", sly: "neutral" },
  owner: { determined: "neutral", scared: "worried", sad: "worried", embarrassed: "worried", pouting: "angry", sly: "neutral" },
  sujin: { worried: "sad", scared: "sad", determined: "neutral", sly: "neutral" },
  youth: { neutral: "worried", angry: "sly", determined: "worried", sad: "worried", embarrassed: "worried", pouting: "worried" },
  child: { worried: "scared", sad: "scared", angry: "scared", determined: "neutral", embarrassed: "neutral", pouting: "neutral", sly: "neutral" },
  officeWorker: { worried: "neutral", scared: "neutral", determined: "neutral", sad: "neutral", embarrassed: "neutral", pouting: "angry", sly: "neutral" },
  elder: { happy: "neutral", scared: "worried", determined: "neutral", sad: "worried", angry: "worried", embarrassed: "worried", pouting: "worried", sly: "neutral" },
  cat: { happy: "neutral", worried: "scared", sad: "scared", angry: "scared", determined: "neutral", embarrassed: "scared", pouting: "scared", sly: "neutral" },
  customer: { happy: "neutral", worried: "neutral", scared: "neutral", determined: "neutral", sad: "neutral", angry: "neutral", embarrassed: "neutral", pouting: "neutral", sly: "neutral" },
};

export const getCharacterSprite = (characterId: CharacterId, emotion: Emotion = "neutral") => {
  const spriteNames = characterSpriteMap[characterId];
  if (!spriteNames) return undefined;
  const fallbackEmotion = semanticFallbacks[characterId]?.[emotion] ?? defaultEmotion[characterId] ?? "neutral";
  const fileName = spriteNames[emotion] ?? spriteNames[fallbackEmotion] ?? spriteNames.neutral;
  return fileName ? getAssetUrl(fileName) : undefined;
};

export const getCharacterAsset = getCharacterSprite;
export const getBackground = (key: string) => getAssetUrl(key);
export const getCg = (key: string) => getAssetUrl(key);
export const getProp = (key: string) => getAssetUrl(key);
export const getUiAsset = (key: string) => getAssetUrl(key);

export const loadedAssetFileNames = [...byFileName.keys()].sort();
