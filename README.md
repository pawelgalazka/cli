# CLI ![node version](https://img.shields.io/node/v/%40pawelgalazka%2Fcli.svg) [![Build Status](https://travis-ci.org/pawelgalazka/cli.svg?branch=master)](https://travis-ci.org/pawelgalazka/cli) [![npm version](https://badge.fury.io/js/%40pawelgalazka%2Fcli.svg)](https://badge.fury.io/js/%40pawelgalazka%2Fcli)
Functions based CLI framework

- [Quick start](#quick-start)
- [Add help](#add-help)
- [Add commands](#add-commands)
- [Add middleware](#add-middleware)
- [Use TypeScript](#use-typescript)

## Quick Start

```sh
$ npm install @pawelgalazka/cli --save
$ touch yourScript.js                    # add your script file
$ chmod a+x ./yourScript.js              # add execute permissions
```

`yourScript.js`:
```js
#!/usr/bin/env node
const { cli } = require('@pawelgalazka/cli')

cli((options, name = '', surname = '') => {
  console.log(`Hello ${name} ${surname}!`)
  if (options.yay) {
    console.log('YAY!')
  }
})
```

```sh
$ ./yourScript.js Pawel Galazka
Hello Pawel Galazka!
```

```sh
$ ./yourScript.js Pawel Galazka --yay
Hello Pawel Galazka!
YAY!
```

## Add help

```js
#!/usr/bin/env node
const { cli, withHelp } = require('@pawelgalazka/cli')

cli(withHelp((options, name = '', surname = '') => {
  console.log(`Hello ${name} ${surname}!`)
  if (options.yay) {
    console.log('YAY!')
  }
}, 'Script description'))
```

```sh
$ ./yourScript.js --help
Usage: yourScript.js

Script description
```

You can also add more detailed `help` which will print out info
about options and params:

```js
#!/usr/bin/env node
const { cli, help } = require('@pawelgalazka/cli')

function command(options, name = '', surname = '') {
  console.log(`Hello ${name} ${surname}!`)
  if (options.yay) {
    console.log('YAY!')
  }  
}

help(command, 'Script description', {
  options: {
    yay: 'print yay'
  },
  params: ['name', 'surname']
})

cli(command)
```

```sh
$ ./yourScript.js --help
Usage: yourScript.js [options] [name surname]

Script description

Options:

  --yay       print yay
```

## Add commands

```js
const { cli, help } = require('@pawelgalazka/cli')

help(cmd1, 'Description of first command')

function cmd1(options) {
  console.log('First command')
}

help(cmd2, 'Description of second command')

function cmd2(options) {
  console.log('Second command')
}

help(defaultCmd, 'Description of default command')
function defaultCmd(options) {
  console.log('Default command')
}

cli({
  cmd1,
  cmd2,
  default: defaultCmd
})
```

```sh
$ ./yourScript.js cmd1
First command
$ ./yourScript.js
Default command
```

Mutlicommand version of cli can as well accept `options` and params which
will be passed to proper function. `--help` generation is handled too.

## Add middleware

You can customise behaviour of `cli` framework by middleware system. `cli`
itself is build on chain of middlewares.

To add custom middleware:

```js
#!/usr/bin/env node
const { cli, useMiddlewares } = require('@pawelgalazka/cli')

const customMiddleware = next => ({ 
    options, 
    params, 
    definition, 
    namespace
  }) => {

  const nextParams = params.map(param => param.toUpperCase())
  // Run next middleware
  next({ options, params: nextParams, definition, namespace })
}

cli((options, name = '', surname = '') => {
  console.log(`Hello ${name} ${surname}!`)
}, useMiddlewares([customMiddleware]))
```

```sh
$ ./yourScript.js Pawel Galazka
Hello PAWEL GALAZKA!
```

What `useMiddlewares` does, it takes your middleware and puts it on the chain
with default middlewares, which looks like this:

```js
[
    errorsHandler(logger),
    argsParser(argv),
    commandFinder,
    helper(logger, argv),
    validator,
    rawArgsParser(argv),
    ...middlewares, // here goes your middlewares
    commandCaller
]
```

So custom middlewares gets called right before calling command functions. You
can totally customise the chain by not using `useMiddlewares`. You can provide array
of middlewares directly to `cli` as a second argument, instead of `useMiddlewares` call.
By this default chain of middlewares will get overwritten.

## Use TypeScript

`cli` has support for `TypeScript`. `TS` types are included within the
library, so you can write your scripts fully in `TypeScript` with usage
of `ts-node`:

```sh
$ npm install ts-node --save-dev
```

`yourScript.ts`:
```ts
#!/usr/bin/env node
import { cli } from '@pawelgalazka/cli'

cli((options, name = '', surname = '') => {
  console.log(`Hello ${name} ${surname}!`)
})
```