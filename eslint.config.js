import neostandard from 'neostandard'

export default [
  { ignores: ['src/popup/skruv-0.7.7/'] },
  ...neostandard({
    env: ['browser', 'webextensions']
  })
]
