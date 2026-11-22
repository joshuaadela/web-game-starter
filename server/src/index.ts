import { defineRoom, defineServer } from "colyseus";
import { NET, ROOM_NAME } from "@game/shared";
import { ArenaRoom } from "./rooms/ArenaRoom";

const port = Number(process.env.PORT ?? NET.defaultPort);

const server = defineServer({
  rooms: {
    [ROOM_NAME]: defineRoom(ArenaRoom),
  },
});

await server.listen(port);
console.log(`Game server listening on ws://localhost:${port}`);
