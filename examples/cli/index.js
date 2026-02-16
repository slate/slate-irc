#!/usr/bin/env node
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { connect } from "node:tls";

import irc from "slate-irc";

const stream = connect({
  port: 6697,
  host: "irc.libera.chat",
});

const client = irc(stream);

const rl = createInterface({ input, output, prompt: "" });

client.use((irc) => irc.stream.pipe(process.stdout)); // logger
client.pass("pass");
client.nick(`slate-${(Math.random() * 100000) | 0}`);
client.user("username", "realname");
client.join("#test");
client.names("#test", (_err, names) => console.log(names));

for await (const line of rl) {
  client.send("#test", line);
}
