import {
  ActionArguments,
  ActionFlags,
  Actions,
  BaseSource,
  fn,
  GatherArguments,
  Item,
  path,
  unknownutil as u,
} from "../deps.ts";

import { isNote, Note } from "../types.ts";
import { filterNotesWithTag, getNotes, paste } from "./common.ts";

export const isActionData = u.isObjectOf({
  path: u.isString,
  note: isNote,
});

export type ActionData = u.PredicateType<typeof isActionData>;

type Params = {
  vault?: string;
  tag?: string;
};

export class Source extends BaseSource<Params> {
  override kind = "file";

  override gather(
    args: GatherArguments<Params>,
  ): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        const tag = u.ensure(
          args.sourceParams?.tag,
          u.isOptionalOf(u.isString),
        );
        let notes: Note[] = [];
        let vault: string;
        if (args.sourceParams?.vault) {
          vault = args.sourceParams.vault;
        } else {
          vault = await fn.expand(args.denops, "~/obsidian") as string;
        }
        notes = await getNotes(vault);
        if (tag) {
          notes = filterNotesWithTag(notes, tag);
        }
        const items: Item<ActionData>[] = [];
        notes.map((note) => {
          items.push({
            word: `${note.name}`,
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

  override actions: Actions<Params> = {
    async appendLink(args: ActionArguments<Params>) {
      for (const item of args.items) {
        if (item.action) {
          const action = item?.action as ActionData;
          let linkPath: string;
          const currentFilePath = await fn.expand(args.denops, "%:p") as string;
          const currentFileDir = path.dirname(currentFilePath);
          const noteDir = path.dirname(action.note.path);
          if (currentFileDir === noteDir) {
            linkPath = path.basename(action.note.path);
          } else {
            linkPath = path.relative(currentFileDir, action.note.path);
          }
          let title: string;
          if (u.isObjectOf({ title: u.isString })(action.note.properties)) {
            title = action.note.properties.title;
          } else {
            title = path.parse(action.note.path).name;
          }
          const link = `[${title ?? "No title"}](${linkPath})`;
          await paste(args.denops, args.context.mode, link, "p");
        }
      }
      return ActionFlags.None;
    },
  };

  override params(): Params {
    return {};
  }
}
