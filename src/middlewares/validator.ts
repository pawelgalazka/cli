import { difference } from 'lodash'

import { CLIError, Middleware } from '../index'
import { optionsToString } from '../utils/options'
import { annotationsMap } from './helper'

export const validator: Middleware = next => args => {
  const { options, command, namespace } = args
  const annotations = annotationsMap.get(command)
  if (typeof annotations !== 'object') {
    return next(args)
  }

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
    throw new CLIError(msg)
  }

  return next(args)
}
