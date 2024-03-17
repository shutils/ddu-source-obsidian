import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
  FilterArguments,
  unknownutil as u,
} from "../deps.ts";

import { isNote } from "../types.ts";
import { getBacklinks } from "../common.ts";

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(
    { items }: FilterArguments<BaseFilterParams>,
  ): Promise<DduItem[]> {
    return Promise.all(items.map(async (item: DduItem) => {
      if (u.isObjectOf({ note: isNote, ...u.isUnknown })(item.action)) {
        const vault = item.action.note.vault;
        const path = item.action.note.path;
        const backlinks = await getBacklinks(vault, path);
        const backlinksCount = backlinks.length ?? 0;
        item.display = `B${backlinksCount} ${item.display ?? item.word}`;
      }
      return item;
    }));
  }
  params() {
    return {};
  }
}
