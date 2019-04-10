export function optionToString(optionName: string) {
  return optionName.length === 1 ? `-${optionName}` : `--${optionName}`
}

export function optionsToString(optionsKeys: string[]) {
  return optionsKeys.map(optionToString).join(' ')
}
