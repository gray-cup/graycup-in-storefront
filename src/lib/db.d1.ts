import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as d1Schema from "./schema.d1";

const cache = new WeakMap<D1Database, DrizzleD1Database<typeof d1Schema>>();

/** One drizzle instance per D1 binding (stable per Worker isolate), cached across requests. */
export function getD1Db(d1: D1Database): DrizzleD1Database<typeof d1Schema> {
  let instance = cache.get(d1);
  if (!instance) {
    instance = drizzle(d1, { schema: d1Schema });
    cache.set(d1, instance);
  }
  return instance;
}

export { d1Schema };
