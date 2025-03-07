#!/usr/bin/env node
import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'

import optimist from 'optimist'
import { WebSocketServer } from 'ws'

const argv = optimist.argv

// Handle new WebSocket client
function new_client(client, req) {
  const clientAddr = client._socket.remoteAddress
  const start_time = new Date().getTime()

  console.log(req.url)
  const log = (msg) => {
    console.log(` ${clientAddr}: ${msg}`)
  }
  log('WebSocket connection')
  log(`Version ${client.protocolVersion}, subprotocol: ${client.protocol}`)

  let rs = null
  if (argv.record) {
    rs = fs.createWriteStream(
      `${argv.record}/${new Date().toISOString().replace(/:/g, '_')}`,
    )
    rs.write('var VNC_frame_data = [\n')
  }

  const target = net.createConnection(target_port, target_host, () => {
    log('connected to target')
  })
  target.on('data', (data) => {
    if (rs) {
      const tdelta = Math.floor(new Date().getTime()) - start_time
      const rsdata = `'{${tdelta}{${decodeBuffer(data)}',\n`
      rs.write(rsdata)
    }

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
    if (rs) {
      rs.end("'EOF'];\n")
    }
  })
  target.on('error', () => {
    log('target connection error')
    target.end()
    client.terminate()
    if (rs) {
      rs.end("'EOF'];\n")
    }
  })

  client.on('message', (msg, _isBinary) => {
    if (rs) {
      const rdelta = Math.floor(new Date().getTime()) - start_time
      const rsdata = `'}${rdelta}}${decodeBuffer(msg)}',\n`
      rs.write(rsdata)
    }

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

function decodeBuffer(buf) {
  let returnString = ''
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] >= 48 && buf[i] <= 90) {
      returnString += String.fromCharCode(buf[i])
    } else if (buf[i] === 95) {
      returnString += String.fromCharCode(buf[i])
    } else if (buf[i] >= 97 && buf[i] <= 122) {
      returnString += String.fromCharCode(buf[i])
    } else {
      const charToConvert = buf[i].toString(16)
      if (charToConvert.length === 0) {
        returnString += '\\x00'
      } else if (charToConvert.length === 1) {
        returnString += `\\x0${charToConvert}`
      } else {
        returnString += `\\x${charToConvert}`
      }
    }
  }
  return returnString
}

// Process an HTTP static file request
function http_request(_request, response) {
  response.writeHead(403, { 'Content-Type': 'text/plain' })
  response.write('403 Permission Denied\n')
  response.end()
}

// parse source and target arguments into parts
let source_host
let source_port
let target_host
let target_port
try {
  const source_arg = argv._[0].toString()
  const target_arg = argv._[1].toString()

  let idx
  idx = source_arg.indexOf(':')
  if (idx >= 0) {
    source_host = source_arg.slice(0, idx)
    source_port = Number.parseInt(source_arg.slice(idx + 1), 10)
  } else {
    source_host = ''
    source_port = Number.parseInt(source_arg, 10)
  }

  idx = target_arg.indexOf(':')
  if (idx < 0) {
    throw 'target must be host:port'
  }
  target_host = target_arg.slice(0, idx)
  target_port = Number.parseInt(target_arg.slice(idx + 1), 10)

  if (Number.isNaN(source_port) || Number.isNaN(target_port)) {
    throw 'illegal port'
  }
} catch (e) {
  console.error(
    'websockify.js [--cert cert.pem [--key key.pem]] [--record dir] [source_addr:]source_port target_addr:target_port',
  )
  process.exit(2)
}

console.log(`\
WebSocket settings:
    - proxying from ${source_host}:${source_port} to ${target_host}:${target_port}`)

let webServer
if (argv.cert) {
  argv.key = argv.key || argv.cert
  const cert = fs.readFileSync(argv.cert)
  const key = fs.readFileSync(argv.key)
  console.log(
    `    - Running in encrypted HTTPS (wss://) mode using: ${argv.cert}, ${argv.key}`,
  )
  webServer = https.createServer({ cert: cert, key: key }, http_request)
} else {
  console.log('    - Running in unencrypted HTTP (ws://) mode')
  webServer = http.createServer(http_request)
}
webServer.listen(source_port, () => {
  const wsServer = new WebSocketServer({ server: webServer })
  wsServer.on('connection', new_client)
})
