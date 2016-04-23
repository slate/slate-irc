# slate-irc

  General purpose IRC client with:

   - plugin system
   - simple api
   - arbitrary input stream
   - __DEBUG__ support for easy debugging

## Installation

```
$ npm install slate-irc
```

## Example

```js

var irc = require('slate-irc');
var net = require('net');

var stream = net.connect({
  port: 6667,
  host: 'irc.freenode.org'
});

var client = irc(stream);

client.pass('pass');
client.nick('tobi');
client.user('tobi', 'Tobi Ferret');

client.join('#express');
client.names('#express', function(err, names){
  console.log(names);
});
```

## API

## Events

  - `data` (msg) parsed IRC message
  - `message` (event) on __PRIVMSG__
  - `notice` (event) on __NOTICE__
  - `invite` (event) on __INVITE__
  - `names` (event) on __RPL_NAMREPLY__
  - `topic` (event) on __TOPIC__
  - `away` (event) on __RPL_AWAY__
  - `quit` (event) on __QUIT__
  - `join` (event) on __JOIN__
  - `part` (event) on __PART__
  - `kick` (event) on __KICK__
  - `mode` (event) on __MODE__
  - `motd` (event) on __RPL_ENDOFMOTD__
  - `nick` (event) on __NICK__
  - `welcome` (nick) on __RPL_WELCOME__
  - `whois` (event) on __RPL_ENDOFWHOIS__
  - `errors` (event) on __ERR_*__
  - `pong` (event) on __PONG__

## Client

Given a stream from `net` or `tls` or another network source, construct an IRC client.

```js
var client = irc(stream);
```

### .pass(pass)

Used at the beginning of connection to specify a 'connection password' for servers requiring a auth.

### .nick(nick)

Specify an `string` irc nick for the user.

### .user(username, realname)

Used at the beginning of connection to specify the username and realname of a new user.

### .invite(name, channel)

Send an invite to `name`, for a `channel`.

### .send(target, msg)

Send a `msg` to the `target` user or channel.

### .action(target, msg)

Send an ACTION `msg` to the `target` user or channel.
Example output: `* erming slaps tj around a bit with a large trout`

### .notice(target, msg)

Send a NOTICE `msg` to the `target` user or channel.

### .ctcp(target, msg)

Send a CTCP notice to the `target` user.

### .join(channel, key)

Send a `JOIN` command for the user to join `channel` with optional `key`.

### .part(channel, msg)

Send a `PART` command for the user to part `channel` with optional `msg`.

### .names(channel, callback)

List names of users in `channel`, calling `callback` with `(error, names)`.

### .away(message)

Set the user's away message to `message`.

### .topic(channel, topic)

Get channel topic or set the topic to `topic`.

### .kick(channels, nicks, msg)

Kick nick(s) from channel(s) with optional `msg`.

### .oper(name, password)

Used to obtain operator privileges.  The combination of `name` and `password` are required to gain Operator privileges.  Upon success, a `'mode'` event will be emitted.

### .mode(target, flags, params)

Used to set a user's mode or channel's mode for a user.

- `.mode('cmilhench', '-o');`
  - // cmilhench 'deopping' himself.
- `.mode('#channel', '+o', 'name');`
  - // give 'chanop' privileges to name on channel #channel.

### .quit(msg)

Disconnect from the server with optional `msg`.

### .whois(target, mask, callback)

Used to query information about particular user.

## Writing Plugins

  Plugins are simply functions that accept the IRC client as an argument. With this you can define methods, listen on events and interact with the
  client. For example here's a logger plugin that outputs to stdout:

```js
function logger() {
  return function(irc){
    irc.stream.pipe(process.stdout);
  }
}
```

  Then `.use()` it like so:

```js
var client = irc(stream);
client.use(logger());
```

  Returning a function like `logger()` instead of `logger` is optional,
  however it's useful to use a closure when passing options, and to keep
  the interface consistent with plugins that _do_ accept options, for example:

```js
function logger(stream) {
  return function(irc){
    irc.stream.pipe(stream);
  }
}

client.use(logger(process.stdout));
```

  Here's a slightly more complex example of a __PONG__ plugin responding to __PING__ messages:

```js
function pong(){
  return function(irc){
    irc.on('data', function(msg){
      if ('PING' != msg.command) return;
      irc.write('PONG :' + msg.trailing);
    });
  }
}
```

## Debugging

  Enable debug output:

```
$ DEBUG=slate-irc node script.js
  slate-irc message NOTICE :asimov.freenode.net NOTICE * :*** Looking up your hostname... +0ms
  slate-irc message NOTICE :asimov.freenode.net NOTICE * :*** Checking Ident +119ms
  slate-irc message NOTICE :asimov.freenode.net NOTICE * :*** Couldn't look up your hostname +1ms
  ...
```

  Enable debug output for a specific plugin:

```
$ DEBUG=slate-irc:names node test.js
  slate-irc:names add #luna-lang ["tjholowaychuk","ramitos","zehl","yawnt","juliangruber"] +0ms
  slate-irc:names emit "names" for #luna-lang +3ms
```

  Enable output of "raw" slate-irc-parser level debug info:

```
$ DEBUG=slate-irc-parser node test.js
` slate-irc-parser line `:rothfuss.freenode.net NOTICE * :*** Looking up your hostname...
  slate-irc-parser message {"prefix":"rothfuss.freenode.net","command":"NOTICE","params":"*","trailing":"*** Looking up your hostname...","string":":rothfuss.freenode.net NOTICE * :*** Looking up your hostname..."} +2ms
` +450msirc-parser line `:rothfuss.freenode.net NOTICE * :*** Checking Ident
  slate-irc-parser message {"prefix":"rothfuss.freenode.net","command":"NOTICE","params":"*","trailing":"*** Checking Ident","string":":rothfuss.freenode.net NOTICE * :*** Checking Ident"} +0ms
```

## Todo

  - examples
  - tcp connection with reconnection (separate lib) (re-auth on connect)

# License

  MIT
