import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
  FilterArguments,
  path,
  unknownutil as u,
} from "../deps.ts";

import { isNote } from "../types.ts";

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(
    { items }: FilterArguments<BaseFilterParams>,
  ): Promise<DduItem[]> {
    return Promise.resolve(items.map((item: DduItem) => {
      if (u.isObjectOf({ note: isNote, ...u.isUnknown })(item.action)) {
        const note = item.action.note;
        const relativePath = path.relative(note.vault.path, note.path);
        item.display = `${relativePath}`;
      }
      return item;
    }));
  }
  params() {
    return {};
  }
}
