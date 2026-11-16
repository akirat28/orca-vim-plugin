import { assert, test } from 'orca/testing'
import { readHighlight } from './settings'

const isHex = (v: string) => /^#[0-9a-f]{3,8}$/i.test(v)

test('defaults follow Orca when nothing is set', () => {
  const { highlight, invalid } = readHighlight({}, isHex)
  assert.deepEqual(highlight, { enabled: true, theme: 'auto', colors: {} })
  assert.deepEqual(invalid, [])
})

test('keeps valid colours, trims them, and reports invalid ones', () => {
  const { highlight, invalid } = readHighlight(
    {
      'highlight.enabled': false,
      'highlight.theme': 'github-dark',
      'color.keyword': ' #ff0000 ',
      'color.string': 'not-a-colour',
      'color.comment': ''
    },
    isHex
  )
  assert.deepEqual(highlight, { enabled: false, theme: 'github-dark', colors: { keyword: '#ff0000' } })
  assert.deepEqual(invalid, ['color.string'])
})
