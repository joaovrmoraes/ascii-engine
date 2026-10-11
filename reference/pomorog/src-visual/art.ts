/** Small, authored text sprites. Shared by world billboards and item panels. */
export const WIZARD_ART = [
  '          /\\             ',
  '         /::\\      *     ',
  '        /::::\\    /|\\   ',
  '       /::::::\\    |     ',
  '      /___..___\\  (=)    ',
  '      /  o  o  \\   |     ',
  '      \\   __  /    |     ',
  '     /::`----\'::\\  |     ',
  '    /::::::::::::\\_|     ',
  '   /::/|::::::|\\::__]    ',
  '   \\_/ |::++::|    |     ',
  '       |::::::|    |     ',
  '      /:::|::::\\   |     ',
  '     /::::|:::::\\  |     ',
  '    /_____|______\\ |     ',
  '      /__|  |__\\        ',
]

export const CREATURE_ART: Record<string, string[]> = {
  beast: [' /\\____/\\  ', '( o    o ) ', ' \\  /\\  /  ', ' /|`--\'|\\  ', '/_|____|_\\ '],
  insect: [' \\  |  / ', ' _\\(@)/_ ', '/  (:)  \\', '  / | \\  '],
  undead: [' .----. ', '| o  o |', ' \\ -- / ', ' /|##|\\ ', '  |  |  '],
  humanoid: ['  /\\/\\  ', ' ( > <) ', ' /|--|\\ ', '  |##|  ', '  /  \\  '],
  aberration: ['  .---.  ', '<( (@) )>', ' `-|-|-\' ', '  /| |\\  '],
  elemental: ['    *    ', '  * @ *  ', ' * @@@ * ', '  * @ *  ', '    *    '],
}

export function monsterArt(id: string, family: string): string[] {
  if (/serpent|snake/.test(id)) return ['   __   _  ', '  /o \\_/ | ', '  \\  __/  ', ' __) /     ', '(____/     ']
  if (/wolf/.test(id)) return [' /\\   /\\  ', '|  \\_/  | ', '|  o o  / ', ' \\  ^  /  ', '  \\___/   ']
  if (/spider/.test(id)) return [' \\ \\ / / ', '  \\(@)/  ', '  /(:)\\  ', ' / / \\ \\ ']
  if (/beetle/.test(id)) return ['   \\ /   ', '  .---.  ', ' /| : |\\ ', ' -| : |- ', '  `---\'  ']
  return CREATURE_ART[family] ?? CREATURE_ART.beast
}
