import type { CharacterId, CharacterProfile } from "../types/game";

export const characters: Record<CharacterId, CharacterProfile> = {
  jihu: { id: "jihu", name: "지후" },
  owner: { id: "owner", name: "점장" },
  sujin: { id: "sujin", name: "수진" },
  child: { id: "child", name: "아이" },
  youth: { id: "youth", name: "청소년" },
  officeWorker: { id: "officeWorker", name: "직장인" },
  elder: { id: "elder", name: "어르신" },
  customer: { id: "customer", name: "손님" },
  cat: { id: "cat", name: "고양이" },
  narrator: { id: "narrator", name: "이야기" },
  notice: { id: "notice", name: "안내" },
};
