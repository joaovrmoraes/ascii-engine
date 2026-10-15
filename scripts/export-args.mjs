const valueKeys = new Set(['title', 'area', 'scene', 'out', 'zoom', 'bundle'])

/** Consume option values exactly once, even when a title looks like a flag. */
export function parseExportArgs(argv) {
  const options = { desktop: false }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--') continue // pnpm's script separator
    if (!argument.startsWith('--')) throw new Error(`Unexpected argument: ${argument}`)
    const equals = argument.indexOf('=')
    const key = argument.slice(2, equals < 0 ? undefined : equals)
    if (key === 'desktop') {
      const value = equals < 0 ? 'true' : argument.slice(equals + 1)
      if (value !== 'true' && value !== 'false') throw new Error('--desktop expects true or false.')
      options.desktop = value === 'true'
    } else {
      if (!valueKeys.has(key)) throw new Error(`Unknown export option: --${key}`)
      const value = equals < 0 ? argv[++index] : argument.slice(equals + 1)
      if (value === undefined || value === '') throw new Error(`Missing value for --${key}`)
      options[key] = value
    }
  }
  return options
}
