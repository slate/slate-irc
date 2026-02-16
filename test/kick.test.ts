import { PassThrough as Stream } from "node:stream";

import { expect, it } from "vitest";

import irc from "../src/index";

it('should emit "kick"', () => {
  const stream = new Stream();
  const client = irc(stream);

  client.on("kick", (e) => {
    expect(e.nick).toStrictEqual("tjholowaychuk");
    expect(e.client).toStrictEqual("tobi");
    expect(e.channel).toStrictEqual("#express");
    expect(e.hostmask.nick).toStrictEqual("tjholowaychuk");
    expect(e.hostmask.username).toStrictEqual("~tjholoway");
    expect(e.hostmask.hostname).toStrictEqual("S01067cb21b2fd643.gv.shawcable.net");
    expect(e.hostmask.string).toStrictEqual(
      "tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net",
    );
  });

  stream.write(
    ":tjholowaychuk!~tjholoway@S01067cb21b2fd643.gv.shawcable.net KICK #express tobi :Too ferrety\r\n",
  );
});
