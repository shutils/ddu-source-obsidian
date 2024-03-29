import { Denops, fn, front_matter, path, unknownutil as u } from "./deps.ts";

import { Note, Tag, Vault } from "./types.ts";

export async function getProperties(filePath: string) {
  const content = await Deno.readTextFile(filePath);
  try {
    return front_matter.extract(content).attrs;
  } catch {
    return {};
  }
}

export async function getBacklinks(vault: Vault, filePath: string) {
  const result = new Deno.Command("rg", {
    args: ["-l", `\\[.*\\]\\(.*${path.basename(filePath)}.*\\)`, vault.path],
  });
  const { success, stdout } = result.outputSync();
  if (!success) {
    return [];
  } else {
    const backlinks: Note[] = [];
    const notePaths = new TextDecoder().decode(stdout)
      .split("\n")
      .filter((line) => line.length > 0);
    await Promise.all(notePaths.map(async (notePath) => {
      const name = path.parse(notePath).name;
      const properties = await getProperties(notePath);
      const note: Note = {
        path: notePath,
        name,
        vault,
        properties,
      };
      backlinks.push(note);
    }));
    return backlinks;
  }
}

export async function getNotes(vault: Vault) {
  const result = new Deno.Command("rg", {
    args: ["--files", vault.path, "--glob", "**/*\\.md"],
  });
  const { success, stdout } = result.outputSync();
  if (!success) {
    return [];
  } else {
    const notes: Note[] = [];
    const notePaths = new TextDecoder().decode(stdout)
      .split("\n")
      .filter((line) => line.length > 0);
    await Promise.all(notePaths.map(async (notePath) => {
      const name = path.parse(notePath).name;
      const properties = await getProperties(notePath);
      const note: Note = {
        path: notePath,
        name,
        vault,
        properties,
      };
      notes.push(note);
    }));
    return notes;
  }
}

export function filterNotesWithTag(notes: Note[], tag: string) {
  return notes.filter((note) => {
    if (
      u.isObjectOf({ tags: u.isArrayOf(u.isString), ...u.isUnknown })(
        note.properties,
      )
    ) {
      return note.properties.tags.includes(tag);
    }
  });
}

export function getPropertyTags(notes: Note[]): Tag[] {
  const tags: Tag[] = [];
  notes.map((note) => {
    if (
      u.isObjectOf({ tags: u.isArrayOf(u.isString), ...u.isUnknown })(
        note.properties,
      )
    ) {
      note.properties.tags.map((tag) => {
        const index = tags.findIndex((t) => t.name === tag);
        if (index === -1) {
          tags.push({ name: tag, count: 1 });
        } else {
          tags[index].count += 1;
        }
      });
    }
  });
  return tags;
}

// This code is from Shougo/ddu-kind-word
// Thanks to Shougo
export const paste = async (
  denops: Denops,
  mode: string,
  text: string,
  pasteKey: string,
) => {
  const oldReg = await fn.getreginfo(denops, '"');

  await fn.setreg(denops, '"', text, "v");
  try {
    await denops.cmd('normal! ""' + pasteKey);
  } finally {
    await fn.setreg(denops, '"', oldReg);
  }

  if (mode === "i") {
    // Cursor move
    const textLen = await fn.strlen(denops, text) as number;
    await fn.cursor(denops, 0, await fn.col(denops, ".") + textLen);
  }

  // Open folds
  await denops.cmd("normal! zv");
};
