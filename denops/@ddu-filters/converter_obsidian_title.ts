import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
  FilterArguments,
  unknownutil as u,
  path,
} from "../deps.ts";

import { isNote } from "../types.ts";

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(
    { items }: FilterArguments<BaseFilterParams>,
  ): Promise<DduItem[]> {
    return Promise.resolve(items.map((item: DduItem) => {
      if (u.isObjectOf({ note: isNote, ...u.isUnknown })(item.action)) {
        if (u.isObjectOf({ title: u.isString })(item.action.note.properties)) {
          const parsedPath = path.parse(item.display ?? item.word)
          item.display = path.join(parsedPath.dir, item.action.note.properties.title)
        }
      }
      return item;
    }));
  }
  params() {
    return {};
  }
}
