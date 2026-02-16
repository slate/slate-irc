import { Writable } from "node:stream";

import irc from "slate-irc";
import websocket from "websocket-stream";

document.head.insertAdjacentHTML(
  "beforeend",
  `<style>
    #root {
      white-space: pre;
      font-family: monospace;
    }
  </style>`,
);

const root = document.getElementById("root");

const browser = new Writable({
  write(chunk, _encoding, callback) {
    root.textContent += chunk.toString();
    callback();
  },
});

const ws = new websocket("ws://localhost", "binary");
ws.on("error", (error) => {
  throw error;
});

const client = irc(ws);
client.use((irc) => irc.stream.pipe(browser));
client.pass("pass");
client.nick(`slate-${(Math.random() * 100000) | 0}`);
client.user("tobi", "Tobi Ferret");
