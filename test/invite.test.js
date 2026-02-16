import { PassThrough as Stream } from "node:stream";

import { expect, it } from "vitest";

import irc from "..";

it('should emit "invite"', () => {
  const stream = new Stream();
  const client = irc(stream);

  client.on("invite", (e) => {
    expect(e.from).toStrictEqual("test");
    expect(e.to).toStrictEqual("astranger");
    expect(e.channel).toStrictEqual("#something");
    expect(e.hostmask.nick).toStrictEqual("test");
    expect(e.hostmask.username).toStrictEqual("~user");
    expect(e.hostmask.hostname).toStrictEqual("example.com");
    expect(e.hostmask.string).toStrictEqual("test!~user@example.com");
  });

  stream.write(":test!~user@example.com INVITE astranger :#something\r\n");
});
