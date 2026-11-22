import { schema, t, type SchemaType } from "@colyseus/schema";

/** Networked player state. Only put what *other* clients need to see here. */
export const Player = schema(
  {
    name: t.string(),
    x: t.number(),
    y: t.number(),
    color: t.number(),
    /** Last input seq the server processed — for reconciliation later. */
    lastSeq: t.number(),
  },
  "Player",
);
export type Player = SchemaType<typeof Player>;

export const ArenaState = schema(
  {
    players: t.map(Player),
  },
  "ArenaState",
);
export type ArenaState = SchemaType<typeof ArenaState>;
