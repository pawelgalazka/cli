import { difference } from 'lodash'

import { ICLIOptions, ICommandFunction } from '../interpreter'
import { optionsToString } from '../utils/options'
import { CLIIllegalOption } from '../utils/errors'

export interface IValidateArguments {
  command: ICommandFunction
  options: ICLIOptions
  namespace: string
}

export function validate({ command, options, namespace }: IValidateArguments) {
  if (typeof command.help !== 'object') {
    return
  }

  const annotations = command.help
  const annotatedOptionsKeys =
    (annotations && annotations.options && Object.keys(annotations.options)) ||
    []
  const optionsKeys = Object.keys(options)
  const illegalOptionsKeys = difference(optionsKeys, annotatedOptionsKeys)

  if (annotatedOptionsKeys.length && illegalOptionsKeys.length) {
    const msg =
      `Illegal option: ${optionsToString(illegalOptionsKeys)}\n` +
      `Available options: ${optionsToString(annotatedOptionsKeys)}\n` +
      `Type "${namespace} --help" for more information`
    throw new CLIIllegalOption(msg)
  }
}
