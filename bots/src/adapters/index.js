import { ao3Adapter } from "./ao3.js";
import { questionableQuestingAdapter } from "./questionablequesting.js";
import { royalRoadAdapter } from "./royalroad.js";
import { spaceBattlesAdapter } from "./spacebattles.js";
import { webnovelAdapter } from "./webnovel.js";

const adapters = new Map([
  [royalRoadAdapter.id, royalRoadAdapter],
  [ao3Adapter.id, ao3Adapter],
  [spaceBattlesAdapter.id, spaceBattlesAdapter],
  [questionableQuestingAdapter.id, questionableQuestingAdapter],
  [webnovelAdapter.id, webnovelAdapter]
]);

export function getAdapter(siteId) {
  const adapter = adapters.get(siteId);
  if (!adapter) {
    throw new Error(`Unknown site adapter: ${siteId}`);
  }

  return adapter;
}

export function listAdapters() {
  return [...adapters.keys()];
}
