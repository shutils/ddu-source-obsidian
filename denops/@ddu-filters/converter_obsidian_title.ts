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
        if (u.isObjectOf({ title: u.isString })(item.action.note.properties)) {
          item.display = item.action.note.properties.title;
        }
      }
      return item;
    }));
  }
  params() {
    return {};
  }
}
