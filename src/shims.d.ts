declare module "debug" {
  type Debugger = {
    (...args: any[]): void;
    enabled: boolean;
    extend(namespace: string, delimiter?: string): Debugger;
  };

  export default function debug(namespace: string): Debugger;
}

declare module "irc-replies" {
  const replies: Record<string, string>;
  export default replies;
}

declare module "websocket-stream" {
  import type { Duplex } from "node:stream";

  type WebsocketFactory = {
    (target: string, protocol?: string): Duplex;
    new (target: string, protocol?: string): Duplex;
  };

  const websocket: WebsocketFactory;
  export default websocket;
}

declare module "slate-irc" {
  import type Parser from "slate-irc-parser";

  import type { IrcClient, IrcStream } from "./types";

  type ClientFactory = {
    (stream: IrcStream, parser?: Parser, encoding?: BufferEncoding): IrcClient;
    new (stream: IrcStream, parser?: Parser, encoding?: BufferEncoding): IrcClient;
  };

  const createClient: ClientFactory;
  export default createClient;
}
