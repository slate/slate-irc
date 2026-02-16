import { PassThrough as Stream } from "node:stream";

import { expect, it } from "vitest";

import irc from "../src/index";

it("should respond with user info", () => {
  const stream = new Stream();
  const client = irc(stream);

  client.whois("colinm", (err, e) => {
    expect(err).toBeUndefined();
    expect(e.hostname).toStrictEqual("client.host.net");
    expect(e.username).toStrictEqual("~colinm");
    expect(e.realname).toStrictEqual("Colin Milhench");
    expect(e.server).toStrictEqual("other.host.net");
    expect(e.channels).toBeInstanceOf(Array);
    expect(e.channels).toHaveLength(4);
    expect(e.channels).toContainEqual("#Node.js");
    expect(e.channels).toContainEqual("#express");
    expect(e.channels).toContainEqual("#some");
    expect(e.channels).toContainEqual("#more");
    expect(e.away).toStrictEqual("brb");
    expect(e.sign).toStrictEqual("1384330635");
    expect(e.idle).toStrictEqual("10543");
  });

  stream.write(":irc.host.net 311 me colinm ~colinm client.host.net * :Colin Milhench\r\n");
  stream.write(":irc.host.net 319 me colinm :#Node.js #express\r\n");
  stream.write(":irc.host.net 319 me colinm :#some #more\r\n");
  stream.write(":irc.host.net 312 me colinm other.host.net :Paris, FR\r\n");
  stream.write(":irc.host.net 301 me colinm :brb\r\n");
  stream.write(":irc.host.net 378 me colinm is connecting from *@client.host.net 127.0.0.1\r\n");
  stream.write(":irc.host.net 317 me colinm 10543 1384330635 seconds idle, signon time\r\n");
  stream.write(":irc.host.net 330 me colinm cmilhench :is logged in as\r\n");
  stream.write(":irc.host.net 318 me colinm :End of /WHOIS list.\r\n");
});

it('should emit "info"', () => {
  const stream = new Stream();
  const client = irc(stream);

  client.on("whois", (err, e) => {
    expect(err).toBeNull();
    expect(e.hostname).toStrictEqual("client.host.net");
    expect(e.username).toStrictEqual("~colinm");
    expect(e.realname).toStrictEqual("Colin Milhench");
    expect(e.server).toStrictEqual("other.host.net");
    expect(e.channels).toBeInstanceOf(Array);
    expect(e.channels).toHaveLength(4);
    expect(e.channels).toContainEqual("#Node.js");
    expect(e.channels).toContainEqual("#express");
    expect(e.channels).toContainEqual("#some");
    expect(e.channels).toContainEqual("#more");
    expect(e.sign).toStrictEqual("1384330635");
    expect(e.idle).toStrictEqual("10543");
  });

  stream.write(":irc.host.net 311 me colinm ~colinm client.host.net * :Colin Milhench\r\n");
  stream.write(":irc.host.net 319 me colinm :#Node.js #express\r\n");
  stream.write(":irc.host.net 319 me colinm :#some #more\r\n");
  stream.write(":irc.host.net 312 me colinm other.host.net :Paris, FR\r\n");
  stream.write(":irc.host.net 378 me colinm is connecting from *@client.host.net 127.0.0.1\r\n");
  stream.write(":irc.host.net 317 me colinm 10543 1384330635 seconds idle, signon time\r\n");
  stream.write(":irc.host.net 330 me colinm cmilhench :is logged in as\r\n");
  stream.write(":irc.host.net 318 me colinm :End of /WHOIS list.\r\n");
});

it('should emit "info"', () => {
  const stream = new Stream();
  const client = irc(stream);

  client.whois("colinm");

  client.on("whois", (err, e) => {
    expect(err).toBeNull();
    expect(e.hostname).toStrictEqual("client.host.net");
    expect(e.username).toStrictEqual("~colinm");
    expect(e.realname).toStrictEqual("Colin Milhench");
    expect(e.server).toStrictEqual("other.host.net");
    expect(e.channels).toBeInstanceOf(Array);
    expect(e.channels).toHaveLength(4);
    expect(e.channels).toContainEqual("#Node.js");
    expect(e.channels).toContainEqual("#express");
    expect(e.channels).toContainEqual("#some");
    expect(e.channels).toContainEqual("#more");
    expect(e.sign).toStrictEqual("1384330635");
    expect(e.idle).toStrictEqual("10543");
  });

  stream.write(":irc.host.net 311 me colinm ~colinm client.host.net * :Colin Milhench\r\n");
  stream.write(":irc.host.net 319 me colinm :#Node.js #express\r\n");
  stream.write(":irc.host.net 319 me colinm :#some #more\r\n");
  stream.write(":irc.host.net 312 me colinm other.host.net :Paris, FR\r\n");
  stream.write(":irc.host.net 378 me colinm is connecting from *@client.host.net 127.0.0.1\r\n");
  stream.write(":irc.host.net 317 me colinm 10543 1384330635 seconds idle, signon time\r\n");
  stream.write(":irc.host.net 330 me colinm cmilhench :is logged in as\r\n");
  stream.write(":irc.host.net 318 me colinm :End of /WHOIS list.\r\n");
});

it("should err with No such nick/channel", () => {
  const stream = new Stream();
  const client = irc(stream);
  client.whois("nonick");
  client.on("whois", (err, _e) => {
    expect(err).toStrictEqual("No such nick/channel");
  });
  stream.write(":irc.freenode.net 401 me nonick :No such nick/channel\r\n");
  stream.write(":irc.freenode.net 318 me nonick :End of /WHOIS list.\r\n");
});

it("should err with No such server", () => {
  const stream = new Stream();
  const client = irc(stream);
  client.whois("nonick", (err, _e) => {
    expect(err).toStrictEqual("No such server");
  });
  stream.write(":holmes.freenode.net 402 me nonick :No such server\r\n");
});

it("should err with Not enough parameters", () => {
  const stream = new Stream();
  const client = irc(stream);
  client.on("whois", (err, _e) => {
    expect(err).toStrictEqual("Not enough parameters");
  });
  stream.write(":irc.freenode.net 461 me WHOIS :Not enough parameters\r\n");
});
