import { defaultVaults } from "./default.ts";

export function ensureVaults(vaults: string[] | undefined) {
  if (vaults === undefined) {
    return defaultVaults;
  }
  return vaults;
}
