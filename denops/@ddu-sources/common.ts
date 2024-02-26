import { Denops, fn, path, unknownutil as u, yaml } from "../deps.ts";

import { isNote, Note } from "../types.ts";

export async function getYamlFrontMatter(path: string) {
  const file = await Deno.readTextFile(path);
  const lines = file.split("\n");
  let content = "";
  let inYaml = false;
  for (const line of lines) {
    if (inYaml) {
      if (line.startsWith("---")) {
        inYaml = false;
        try {
          return u.ensure(
            yaml.parse(content),
            u.isObjectOf({ ...u.isUnknown }),
          );
        } catch {
          return {};
        }
      } else {
        content += line + "\n";
      }
    } else {
      if (line.startsWith("---")) {
        inYaml = true;
      }
    }
  }
}

export async function getNotes(vault: string) {
  const result = new Deno.Command("rg", {
    args: ["--files", vault, "--glob", "**/*\\.md"],
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
      const properties = await getYamlFrontMatter(notePath);
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

export function getPropertyTags(notes: Note[]): string[] {
  const tags = new Set<string>();
  notes.forEach((note) => {
    if (isNote(note)) {
      if (
        u.isObjectOf({ tags: u.isArrayOf(u.isString), ...u.isUnknown })(
          note.properties,
        )
      ) {
        note.properties.tags.forEach((tag) => tags.add(tag));
      }
    }
  });
  return Array.from(tags);
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