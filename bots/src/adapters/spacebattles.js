import { createXenforoAdapter } from "./xenforo.js";

export const spaceBattlesAdapter = createXenforoAdapter({
  id: "spacebattles",
  baseUrl: "https://forums.spacebattles.com",
  defaultForumUrl: "https://forums.spacebattles.com/forums/creative-writing.18/"
});
