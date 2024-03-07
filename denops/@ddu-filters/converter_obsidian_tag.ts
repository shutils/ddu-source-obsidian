import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
  FilterArguments,
  unknownutil as u,
} from "../deps.ts";

const isAction = u.isObjectOf({
  tag: u.isObjectOf({
    name: u.isString,
    count: u.isNumber,
  }),
  ...u.isUnknown,
});

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(
    { items }: FilterArguments<BaseFilterParams>,
  ): Promise<DduItem[]> {
    const maxCountWidth = Math.max(
      ...items.map((item) => {
        if (isAction(item.action)) {
          return item.action.tag.count.toString().length;
        }
        return 0;
      }),
    );
    return Promise.all(items.map((item: DduItem) => {
      if (
        u.isObjectOf({
          tag: u.isObjectOf({
            name: u.isString,
            count: u.isNumber,
            ...u.isUnknown,
          }),
          ...u.isUnknown,
        })(item.action)
      ) {
        const action = item.action;
        item.display = `${action.tag.count.toString().padStart(maxCountWidth)} ${item.display ?? item.word}`;
      }
      return item;
    }));
  }
  params() {
    return {};
  }
}
