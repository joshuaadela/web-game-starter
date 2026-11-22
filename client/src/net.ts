import { Client, type Room } from "@colyseus/sdk";
import { ArenaState, NET, ROOM_NAME } from "@game/shared";

/** Server URL: same host the page was loaded from, so phones on your LAN work. */
function serverUrl(): string {
  const env = import.meta.env.VITE_SERVER_URL as string | undefined;
  if (env) return env;
  const proto = location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${location.hostname}:${NET.defaultPort}`;
}

export async function joinArena(name: string): Promise<Room<any, ArenaState>> {
  const client = new Client(serverUrl());
  return client.joinOrCreate(ROOM_NAME, { name }, ArenaState);
}
