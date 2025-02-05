import { expect, it } from 'vitest'

import irc from '..'
import { PassThrough as Stream } from 'stream'

it('should respond with user names', () =>
  new Promise((done) => {
    const stream = new Stream()
    const client = irc(stream)

    client.names('#luna-lang', (err, names) => {
      if (err) return done(err)
      expect(names).toStrictEqual([
        { name: 'owner', mode: '~' },
        { name: 'foo', mode: '@' },
        { name: 'halfop', mode: '%' },
        { name: 'bar', mode: '+' },
        { name: 'baz', mode: '' },
        { name: 'some', mode: '' },
        { name: 'more', mode: '' },
      ])
      done()
    })

    setImmediate(() => {
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
  }))

it('should emit "names"', () =>
  new Promise((done) => {
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
      done()
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
  }))

it('should retain ~ / @ / % / +', () =>
  new Promise((done) => {
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
      done()
    })

    stream.write(':tobi!~tobi@184.151.231.170 JOIN #luna-lang\r\n')
    stream.write(
      ':rothfuss.freenode.net 353 tjholowaychuk @ ##luna-lang :~owner @tjholowaychuk %halfop +tobi\r\n',
    )
    stream.write(
      ':rothfuss.freenode.net 366 tjholowaychuk ##luna-lang :End of /NAMES list.\r\n',
    )
  }))
