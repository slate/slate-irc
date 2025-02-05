import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'node:stream'

it('should respond with user names', () => {
  const stream = new Stream()
  const client = irc(stream)

  client.names('#luna-lang', (err, names) => {
    expect(err).toBeNull()
    expect(names).toStrictEqual([
      { name: 'owner', mode: '~' },
      { name: 'foo', mode: '@' },
      { name: 'halfop', mode: '%' },
      { name: 'bar', mode: '+' },
      { name: 'baz', mode: '' },
      { name: 'some', mode: '' },
      { name: 'more', mode: '' },
    ])
  })

  stream.write(
    ':pratchett.freenode.net 353 tjholowaychuk = #luna-lang :~owner @foo %halfop +bar baz\r\n',
  )
  stream.write(
    ':pratchett.freenode.net 353 tjholowaychuk = #luna-lang :some more\r\n',
  )
  stream.write(
    ':pratchett.freenode.net 366 tjholowaychuk #luna-lang :End of /NAMES list.\r\n',
  )
})

it('should emit "names"', () => {
  const stream = new Stream()
  const client = irc(stream)

  client.on('names', (e) => {
    expect(e.channel).toStrictEqual('#luna-lang')
    expect(e.names).toStrictEqual([
      { name: 'one', mode: '' },
      { name: 'two', mode: '~' },
      { name: 'three', mode: '' },
      { name: 'foo', mode: '@' },
      { name: 'bar', mode: '@' },
      { name: 'baz', mode: '%' },
    ])
  })

  stream.write(':tobi!~tobi@184.151.231.170 JOIN #luna-lang\r\n')
  stream.write(
    ':rothfuss.freenode.net 353 tjholowaychuk = #luna-lang :one ~two three\r\n',
  )
  stream.write(
    ':rothfuss.freenode.net 353 tjholowaychuk = #luna-lang :@foo @bar %baz\r\n',
  )
  stream.write(
    ':rothfuss.freenode.net 366 tjholowaychuk #luna-lang :End of /NAMES list.\r\n',
  )
})

it('should retain ~ / @ / % / +', () => {
  const stream = new Stream()
  const client = irc(stream)

  client.on('names', (e) => {
    expect(e.channel).toStrictEqual('##luna-lang')
    expect(e.names).toStrictEqual([
      { name: 'owner', mode: '~' },
      { name: 'tjholowaychuk', mode: '@' },
      { name: 'halfop', mode: '%' },
      { name: 'tobi', mode: '+' },
    ])
  })

  stream.write(':tobi!~tobi@184.151.231.170 JOIN #luna-lang\r\n')
  stream.write(
    ':rothfuss.freenode.net 353 tjholowaychuk @ ##luna-lang :~owner @tjholowaychuk %halfop +tobi\r\n',
  )
  stream.write(
    ':rothfuss.freenode.net 366 tjholowaychuk ##luna-lang :End of /NAMES list.\r\n',
  )
})
