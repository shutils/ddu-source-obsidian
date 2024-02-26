import { unknownutil as u } from "./deps.ts";

export const isNote = u.isObjectOf({
  path: u.isString,
  name: u.isString,
  vault: u.isString,
  properties: u.isOptionalOf(u.isObjectOf({ ...u.isUnknown })),
});

export type Note = u.PredicateType<typeof isNote>;
