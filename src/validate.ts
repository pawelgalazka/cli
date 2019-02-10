import { difference } from 'lodash'

import { CLIError } from './errors'
import { IAnnoations } from './help'
import { IOptions } from './parse'
import { optionsToString } from './utils'

export function validate(
  annotations: IAnnoations,
  options: IOptions,
  scriptName: string
) {
  const annotatedOptionsKeys =
    (annotations && annotations.options && Object.keys(annotations.options)) ||
    []
  const optionsKeys = Object.keys(options)
  const illegalOptionsKeys = difference(optionsKeys, annotatedOptionsKeys)

  if (annotatedOptionsKeys.length && illegalOptionsKeys.length) {
    const msg =
      `Illegal option: ${optionsToString(illegalOptionsKeys)}\n` +
      `Available options: ${optionsToString(annotatedOptionsKeys)}\n` +
      `Type "${scriptName} --help" for more information`
    throw new CLIError(msg)
  }
}
