# CLI ![node version](https://img.shields.io/node/v/%40pawelgalazka%2Fcli.svg) [![Build Status](https://travis-ci.org/pawelgalazka/cli.svg?branch=master)](https://travis-ci.org/pawelgalazka/cli) [![npm version](https://badge.fury.io/js/%40pawelgalazka%2Fcli.svg)](https://badge.fury.io/js/%40pawelgalazka%2Fcli)
CLI scripts micro engine

```sh
$ npm install @pawelgalazka/cli --save
```

```js
#!/usr/bin/env node
const { cli, help } = require('@pawelgalazka/cli')

help(main, 'Script doc')
function main (options, p1, p2) {
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
}

cli({
  default: main
})
```

```
$ script.js -a --foo=bar --boo abc def
OPTIONS {a: true, foo: 'bar', boo: true }
P1 abc
P2 def

$ script.js --help
Usage: script.js

Script doc
```

### Annotations

```js
#!/usr/bin/env node
const { cli, help } = require('@pawelgalazka/cli')

help(main, {
  description: 'Basic script description',
  params: ['p1', 'p2'],
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  },
  examples: 'some examples'
})
function main (options, p1, p2) {
  console.log('OPTIONS', options)
  console.log('P1', p1)
  console.log('P2', p2)
}

cli({
  default: main
})
```

```
$ script.js --help
Usage: script.js [options] [p1 p2]

Basic script description

Options:

    -a         description for a option
    --foo      description for foo option
    
Examples:

some examples
```

Annotations plays part also in validating process. So if
option which does not exist in annotations is provided, `microcli` will
throw an error:

```
$ script.js --bar
Illegal option: --bar
Available options: -a --foo
Type "script.js --help" for more information
```

Also each annotation is optional and custom annotations like `examples`
(basically other than description, params and options) will be treated
in `--help` content as additional header with string value.

### Commands


```js
#!/usr/bin/env node
const { cli, help } = require('@pawelgalazka/cli')

help(cmd1, 'Script doc 1')
function cmd1 (options) {
  console.log('Command 1')
}

help(cmd2, 'Script doc 2')
function cmd2 (options) {
  console.log('Command 1')
}

cli({
  cmd1,
  cmd2
})
```

```
$ script.js cmd1
Command 1

$ script.js cmd2
Command 2
```
