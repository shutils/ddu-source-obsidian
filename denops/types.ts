import { unknownutil as u } from "./deps.ts";

export const isVault = u.isObjectOf({
  path: u.isString,
  name: u.isString,
});

export const isBacklink = u.isObjectOf({
  path: u.isString,
  name: u.isString,
  vault: isVault,
  properties: u.isOptionalOf(u.isObjectOf({ ...u.isUnknown })),
});

export const isNote = u.isObjectOf({
  path: u.isString,
  name: u.isString,
  vault: isVault,
  properties: u.isOptionalOf(u.isObjectOf({ ...u.isUnknown })),
  backlinks: u.isOptionalOf(u.isArrayOf(isBacklink)),
});

export type Vault = u.PredicateType<typeof isVault>;

export type Note = u.PredicateType<typeof isNote>;

export type Tag = {
  name: string;
  count: number;
}
