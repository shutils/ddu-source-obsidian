import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
  FilterArguments,
  unknownutil as u,
} from "../deps.ts";

import { getProperties } from "../common.ts";

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(
    { items }: FilterArguments<BaseFilterParams>,
  ): Promise<DduItem[]> {
    return Promise.all(items.map(async (item: DduItem) => {
      if (u.isObjectOf({ path: u.isString, ...u.isUnknown })(item.action)) {
        if (
          u.isObjectOf({ isDirectory: u.isBoolean, ...u.isUnknown })(
            item.action,
          )
        ) {
          if (item.action.isDirectory) {
            return item;
          }
        }
        const properties = await getProperties(item.action.path);
        if (u.isObjectOf({ title: u.isString, ...u.isUnknown })(properties)) {
          item.display = `${item.display ?? item.word} (${properties.title})`;
        }
      }
      return item;
    }));
  }
  params() {
    return {};
  }
}
