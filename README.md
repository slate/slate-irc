slate-irc [![version] ![downloads]][npm]
========
General purpose IRC client for nodejs. See **[documentation]** for the details.

- Plugin system
- Simple api
- Arbitrary input stream
- **[DEBUG]** support for easy debugging

```bash
npm install --save slate-irc-parser
yarn add -D slate-irc-parser
```
```js
import irc from 'slate-irc'
import net from 'net'

const stream = net.connect({
  port: 6667,
  host: 'irc.freenode.org'
})

const client = irc(stream)

client.pass('pass')
client.nick('tobi')
client.user('tobi', 'Tobi Ferret')

client.join('#express')
client.names('#express', (err, names) => {
  console.log(names)
})
```

--------

MIT License

[version]: https://badgen.net/npm/v/slate-irc
[downloads]: https://badgen.net/npm/dt/slate-irc
[npm]: https://npmjs.org/package/slate-irc

[documentation]: docs.md
[DEBUG]: https://github.com/visionmedia/debug
