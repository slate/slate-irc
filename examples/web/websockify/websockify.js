#!/usr/bin/env node
import net from 'node:net'

import optimist from 'optimist'
import { WebSocketServer } from 'ws'

const argv = optimist.argv

// Handle new WebSocket client
function new_client(client, req) {
  const clientAddr = client._socket.remoteAddress

  console.log(req.url)
  const log = (msg) => {
    console.log(` ${clientAddr}: ${msg}`)
  }
  log('WebSocket connection')
  log(`Version ${client.protocolVersion}, subprotocol: ${client.protocol}`)

  const target = net.createConnection(target_port, target_host, () => {
    log('connected to target')
  })
  target.on('data', (data) => {
    try {
      client.send(data)
    } catch (e) {
      log('Client closed, cleaning up target')
      target.end()
    }
  })
  target.on('end', () => {
    log('target disconnected')
    client.terminate()
  })
  target.on('error', () => {
    log('target connection error')
    target.end()
    client.terminate()
  })

  client.on('message', (msg, _isBinary) => {
    target.write(msg)
  })
  client.on('close', (code, reason) => {
    log(`WebSocket client disconnected: ${code} [${reason}]`)
    target.end()
  })
  client.on('error', (a) => {
    log(`WebSocket client error: ${a}`)
    target.end()
  })
}

// parse source and target arguments into parts
let source_port
let target_host
let target_port
try {
  const source_arg = argv._[0].toString()
  const target_arg = argv._[1].toString()

  source_port = Number.parseInt(source_arg, 10)

  const idx = target_arg.indexOf(':')
  if (idx < 0) {
    throw 'target must be host:port'
  }
  target_host = target_arg.slice(0, idx)
  target_port = Number.parseInt(target_arg.slice(idx + 1), 10)

  if (Number.isNaN(source_port) || Number.isNaN(target_port)) {
    throw 'illegal port'
  }
} catch (e) {
  console.error('websockify.js source_port target_addr:target_port')
  process.exit(2)
}

console.log(
  `Proxying ws://localhost:${source_port}/ to tcp://${target_host}:${target_port}`,
)

const wsServer = new WebSocketServer({ port: source_port })
wsServer.on('connection', new_client)
