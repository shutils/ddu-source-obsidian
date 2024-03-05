import {
  BaseSource,
  GatherArguments,
  Item,
  unknownutil as u,
} from "../deps.ts";

import {  Note } from "../types.ts";
import { getNotes, getPropertyTags } from "../common.ts";
import { ensureVaults } from "../helper.ts";

type Params = {
  vaults?: string[];
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
        const vaults = ensureVaults(args.sourceParams?.vaults);
        const notes: Note[] = [];
        await Promise.all(vaults.map(async (vault) => {
          notes.push(...await getNotes(vault));
        }));
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
