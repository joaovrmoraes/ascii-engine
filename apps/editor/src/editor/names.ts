/** Display labels for legacy preset IDs. IDs stay stable in saved scenes. */
const effects: Record<string, string> = {
  fogueira: 'Campfire', poeira: 'Dust', vagalumes: 'Fireflies', morte: 'Dissolve',
  aura: 'Aura', raio: 'Lightning', 'explosao-de-fogo': 'Fire explosion', gelo: 'Ice',
  'anel-de-chuva': 'Rain ripple', rastro: 'Trail',
}
export const effectName = (id: string) => effects[id] ?? id
