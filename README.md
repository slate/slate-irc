slate-irc [![Build Status]][travis] [![Version]][npm]
========
General purpose IRC client for nodejs. See [documentation] for the details.

- Plugin system
- Simple api
- Arbitrary input stream
- **[DEBUG]** support for easy debugging

[DEBUG]: https://github.com/visionmedia/debug
[documentation]: docs.md

```bash
$ npm install --save slate-irc
```
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

--------

MIT License

[Version]: https://img.shields.io/npm/v/slate-irc.svg
[Build Status]: https://travis-ci.org/slate/slate-irc.svg?branch=master

[npm]: https://npmjs.org/package/slate-irc
[travis]: https://travis-ci.org/slate/slate-irc
