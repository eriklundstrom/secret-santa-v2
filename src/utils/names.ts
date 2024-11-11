export const Names = [
  'Erik',
  'Inger',
  'Lasse',
  'Micke',
  'Manisa',
  'Lena',
  'Robin',
] as const

export type NamesLiteral = (typeof Names)[number]
