import { unknownutil as u } from "./deps.ts";

export const isBacklink = u.isObjectOf({
  path: u.isString,
  name: u.isString,
  vault: u.isString,
  properties: u.isOptionalOf(u.isObjectOf({ ...u.isUnknown })),
});

export const isNote = u.isObjectOf({
  path: u.isString,
  name: u.isString,
  vault: u.isString,
  properties: u.isOptionalOf(u.isObjectOf({ ...u.isUnknown })),
  backlinks: u.isOptionalOf(u.isArrayOf(isBacklink)),
});

export type Note = u.PredicateType<typeof isNote>;
