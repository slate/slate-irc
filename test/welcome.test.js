import { PassThrough as Stream } from "node:stream";

import { expect, it } from "vitest";

import irc from "..";

it("should set client.me to the users nick", () => {
  const stream = new Stream();
  const client = irc(stream);
  stream.write(
    ":cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n",
  );
  process.nextTick(() => {
    expect(client.me).toStrictEqual("tobi");
  });
});

it('should emit "welcome"', () => {
  const stream = new Stream();
  const client = irc(stream);

  client.on("welcome", (nick) => {
    expect(nick).toStrictEqual("tobi");
  });

  stream.write(
    ":cameron.freenode.net 001 tobi :Welcome to the freenode Internet Relay Chat Network tobi\r\n",
  );
});
