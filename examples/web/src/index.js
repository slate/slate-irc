import irc from 'slate-irc'
import websocket from 'websocket-stream'
import BrowserStdout from 'browser-stdout'

const stream = new websocket('ws://localhost', 'binary')
stream.on('error', (error) => {
  throw error
})

const client = irc(stream)
client.use((irc) => irc.stream.pipe(BrowserStdout())) // Pipe to browser log.
client.pass('pass')
client.nick(`slate-${(Math.random() * 100000) | 0}`)
client.user('tobi', 'Tobi Ferret')

const root = document.getElementById('root')
root.textContent = 'Open your console and see the irc log!'
