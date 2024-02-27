import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
  FilterArguments,
  unknownutil as u,
} from "../deps.ts";

import { isNote } from "../types.ts";

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(
    { items }: FilterArguments<BaseFilterParams>,
  ): Promise<DduItem[]> {
    return Promise.resolve(items.map((item: DduItem) => {
      if (u.isObjectOf({ note: isNote, ...u.isUnknown })(item.action)) {
        const backlinksCount = item.action.note.backlinks?.length ?? 0;
        item.display = `B${backlinksCount} ${item.display ?? item.word}`;
      }
      return item;
    }));
  }
  params() {
    return {};
  }
}
