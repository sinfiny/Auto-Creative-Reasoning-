import { createXenforoAdapter } from "./xenforo.js";

export const questionableQuestingAdapter = createXenforoAdapter({
  id: "questionablequesting",
  baseUrl: "https://forum.questionablequesting.com",
  defaultForumUrl: "https://forum.questionablequesting.com/forums/creative-writing.19/"
});
