import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
  FilterArguments,
  unknownutil as u,
} from "../deps.ts";

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(
    { items }: FilterArguments<BaseFilterParams>,
  ): Promise<DduItem[]> {
    return Promise.all(items.map((item: DduItem) => {
      if (
        u.isObjectOf({
          note: u.isObjectOf({
            vault: u.isObjectOf({ name: u.isString, ...u.isUnknown }),
            ...u.isUnknown,
          }),
          ...u.isUnknown,
        })(item.action)
      ) {
        const action = item.action;
        item.display = `(${action.note.vault.name}) ${
          item.display ?? item.word
        }`;
      }
      return item;
    }));
  }
  params() {
    return {};
  }
}
