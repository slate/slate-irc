import { connect } from 'node:tls'

import irc from '../dist/slate-irc.modern.mjs'

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
client.nick(`slate-${Math.random() * 100000 | 0}`)
client.user('username', 'realname')
client.join('#test')
client.names('#test', (_err, names) => {
  console.log(names)
})
