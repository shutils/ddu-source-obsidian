import {
  BaseSource,
  GatherArguments,
  Item,
  unknownutil as u,
} from "../deps.ts";

import { isNote, Note } from "../types.ts";
import { getBacklinks } from "../common.ts";
import { ensureVaults } from "../helper.ts";

export const isActionData = u.isObjectOf({
  path: u.isString,
  note: isNote,
});

export type ActionData = u.PredicateType<typeof isActionData>;

type Params = {
  vaults?: string[];
  notePath: string;
};

export class Source extends BaseSource<Params> {
  override kind = "file";

  override gather(
    args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        const notes: Note[] = [];
        const vaults = ensureVaults(args.sourceParams?.vaults);
        const notePath = u.ensure(args.sourceParams?.notePath, u.isString);
        if (notePath === "") {
          controller.close();
          return;
        }
        await Promise.all(vaults.map(async (vault) => {
          notes.push(...await getBacklinks(vault, notePath));
        }));
        const items: Item<ActionData>[] = [];
        notes.map((note) => {
          items.push({
            word: `${note.path}`,
            action: {
              path: note.path,
              note,
            },
          });
        });
        controller.enqueue(items);
        controller.close();
      },
    });
  }

  override params(): Params {
    return {
      notePath: "",
    };
  }
}
