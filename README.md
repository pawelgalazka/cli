# CLI ![node version](https://img.shields.io/node/v/%40pawelgalazka%2Fcli.svg) [![Build Status](https://travis-ci.org/pawelgalazka/cli.svg?branch=master)](https://travis-ci.org/pawelgalazka/cli) [![npm version](https://badge.fury.io/js/%40pawelgalazka%2Fcli.svg)](https://badge.fury.io/js/%40pawelgalazka%2Fcli-args)
CLI scripts micro engine

```js
#!/usr/bin/env node
const cli = require('@pawelgalazka/cli')
const cliScript = cli(process.argv, 'Script doc');
cliScript((options, p1, p2) => {
    console.log('OPTIONS', options)
    console.log('P1', p1)
    console.log('P2', p2)
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
const cli = require('@pawelgalazka/cli')
const cliScript = cli(process.argv, {
  description: 'Basic script description',
  params: ['p1', 'p2'],
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  },
  examples: 'some examples'
});

cliScript((options, p1, p2) => {
    console.log('OPTIONS', options)
    console.log('P1', p1)
    console.log('P2', p2)
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

### Custom --help

You can provide `help` function to `cli` call, which can generate
custom help message, having annotations object:

```js
#!/usr/bin/env node
const cli = require('@pawelgalazka/cli')
const cliScript = cli(process.argv, {
  /* some annotations */
}, (scriptName, annotations, logger) => {
  logger.log('Custom --help message') 
});

cliScript((options, p1, p2) => {
    console.log('OPTIONS', options)
    console.log('P1', p1)
    console.log('P2', p2)
})
```
