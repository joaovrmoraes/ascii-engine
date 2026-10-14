/** View state belongs to the editor session, never to SceneDoc. */
export function createViewControls(view: { paused: boolean }) {
  const listeners = new Set<(paused: boolean) => void>()
  return {
    get paused() { return view.paused },
    toggle() { view.paused = !view.paused; for (const listener of listeners) listener(view.paused) },
    subscribe(listener: (paused: boolean) => void) {
      listeners.add(listener); listener(view.paused)
      return () => listeners.delete(listener)
    },
  }
}
export type ViewControls = ReturnType<typeof createViewControls>
