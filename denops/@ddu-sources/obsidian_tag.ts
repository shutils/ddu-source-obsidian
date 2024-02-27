import {
  BaseSource,
  fn,
  GatherArguments,
  Item,
  unknownutil as u,
} from "../deps.ts";

import { getNotes, getPropertyTags } from "../common.ts";

type Params = {
  vault?: string;
};

export const isActionData = u.isObjectOf({
  text: u.isString,
  tag: u.isString,
});

export type ActionData = u.PredicateType<typeof isActionData>;

export class Source extends BaseSource<Params> {
  override kind = "word";

  override gather(
    args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        let vault: string;
        if (args.sourceParams?.vault) {
          vault = args.sourceParams.vault;
        } else {
          vault = await fn.expand(args.denops, "~/obsidian") as string;
        }
        const notes = await getNotes(vault);
        const tags = getPropertyTags(notes);
        const items: Item<ActionData>[] = [];
        for (const tag of tags) {
          items.push({
            word: tag,
            action: {
              text: tag,
              tag,
            },
          });
        }
        controller.enqueue(items);
        controller.close();
      },
    });
  }

  override params(): Params {
    return {};
  }
}
