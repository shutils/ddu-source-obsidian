import { Denops, fn, unknownutil as u } from "./deps.ts";

import { defaultVaultName, defaultVaultPath } from "./default.ts";
import { Vault } from "./types.ts";

export async function ensureVaults(
  denops: Denops,
  vaults: Vault[] | undefined,
) {
  if (vaults === undefined) {
    return [{
      name: defaultVaultName,
      path: u.ensure(await fn.expand(denops, defaultVaultPath), u.isString),
    }];
  }
  return vaults;
}
