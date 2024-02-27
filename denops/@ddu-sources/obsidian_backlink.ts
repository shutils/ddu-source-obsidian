import {
  BaseSource,
  fn,
  GatherArguments,
  Item,
  unknownutil as u,
} from "../deps.ts";

import { isNote, Note } from "../types.ts";
import { getBacklinks } from "../common.ts";

export const isActionData = u.isObjectOf({
  path: u.isString,
  note: isNote,
});

export type ActionData = u.PredicateType<typeof isActionData>;

type Params = {
  vault?: string;
  notePath: string;
};

export class Source extends BaseSource<Params> {
  override kind = "file";

  override gather(
    args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        let notes: Note[] = [];
        let vault: string;
        const notePath = u.ensure(args.sourceParams?.notePath, u.isString);
        if (notePath === "") {
          controller.close();
          return;
        }
        if (args.sourceParams?.vault) {
          vault = args.sourceParams.vault;
        } else {
          vault = await fn.expand(args.denops, "~/obsidian") as string;
        }
        notes = await getBacklinks(vault, notePath);
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
