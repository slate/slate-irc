import { PassThrough as Stream } from "node:stream";

import { expect, it } from "vitest";

import irc from "..";

it("should respond with PONG", () => {
  const stream = new Stream();
  irc(stream);

  let n = 0;
  stream.on("data", (chunk) => {
    switch (n++) {
      case 0:
        expect(chunk).toStrictEqual("PING :rothfuss.freenode.net\r\n");
        break;
      case 1:
        expect(chunk).toStrictEqual("PONG :rothfuss.freenode.net\r\n");
        break;
    }
  });

  stream.write("PING :rothfuss.freenode.net\r\n");
});
