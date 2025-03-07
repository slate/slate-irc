slate-irc [![version] ![downloads]][npm]
========
General purpose IRC client for nodejs. See **[documentation]** for the details.

- Plugin system
- Simple api
- Arbitrary input stream
- **[DEBUG]** support for easy debugging

```bash
pnpm add -D slate-irc-parser
```
```js
import irc from 'slate-irc'
import { connect } from 'node:tls'

const stream = connect({
  port: 6697,
  host: 'irc.libera.chat',
})

const client = irc(stream)

// logger
client.use((irc) => {
  irc.stream.pipe(process.stdout)
})

client.pass('pass')
client.nick('tobi')
client.user('tobi', 'Tobi Ferret')
client.join('#express')
client.names('#express', (_err, names) => {
  console.log(names)
})
```

To see more examples, please check the [`examples`](examples) directory.

&nbsp;

--------
*slate-irc* is primarily distributed under the terms of the [MIT license]. See
[COPYRIGHT] for details.

[version]: https://badgen.net/npm/v/slate-irc
[downloads]: https://badgen.net/npm/dt/slate-irc
[npm]: https://npmjs.org/package/slate-irc

[documentation]: docs.md
[DEBUG]: https://github.com/visionmedia/debug

[MIT license]: LICENSE
[COPYRIGHT]: COPYRIGHT
