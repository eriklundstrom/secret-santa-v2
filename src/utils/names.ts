export const Names = [
  'Erik',
  'Inger',
  'Lasse',
  'Micke',
  'Manisa',
  'Lena',
  'Robin',
  'Thawa',
] as const

export type NamesLiteral = (typeof Names)[number]
