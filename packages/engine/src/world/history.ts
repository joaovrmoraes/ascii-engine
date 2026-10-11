/** Document history, bounded by action count and serialized size (large assets). */
export function createHistory<T>(initial: T, limit = 40, maxBytes = 64 * 1024 * 1024) {
  let states = [JSON.stringify(initial)], cursor = 0
  const read = () => JSON.parse(states[cursor]) as T
  return {
    get canUndo() { return cursor > 0 },
    get canRedo() { return cursor < states.length - 1 },
    current: read,
    commit(value: T) {
      const encoded = JSON.stringify(value)
      if (encoded === states[cursor]) return false
      states = states.slice(0, cursor + 1); states.push(encoded)
      let bytes = states.reduce((total, state) => total + state.length * 2, 0)
      while (states.length > 1 && (states.length > Math.max(0, limit) + 1 || bytes > maxBytes)) bytes -= states.shift()!.length * 2
      cursor = states.length - 1
      return true
    },
    undo() { if (cursor > 0) cursor--; return read() },
    redo() { if (cursor < states.length - 1) cursor++; return read() },
    reset(value: T) { states = [JSON.stringify(value)]; cursor = 0 },
  }
}
