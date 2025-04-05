const SEPARATOR = ':'

export function getFullIconName(prefix: string, name: string) {
  return `${prefix}${SEPARATOR}${name}`
}
