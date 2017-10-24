# microcli ![node version](https://img.shields.io/node/v/microcli.svg) [![Build Status](https://travis-ci.org/pawelgalazka/microcli.svg?branch=master)](https://travis-ci.org/pawelgalazka/microcli) [![npm version](https://badge.fury.io/js/microcli.svg)](https://badge.fury.io/js/microcli)
CLI scripts micro engine

```js
#!/usr/bin/env node
const microcli = require('microcli')
const cli = microcli(process.argv);
cli((options, p1, p2) => {
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

```

### Annotations

```js
#!/usr/bin/env node
const microcli = require('microcli')
const cli = microcli(process.argv, {
  description: 'Basic script description',
  params: {
    p1: 'description for p1 param',
    p2: 'description for p2 param'
  },
  options: {
    a: 'description for a option',
    foo: 'description for foo option'
  }
});

cli((options, p1, p2) => {
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
```

### Custom --help

You can provide `help` function to `cli` call, which can generate
custom help message, having annotations object:

```js
#!/usr/bin/env node
const microcli = require('microcli')
const cli = microcli(process.argv, {
  /* some annotations */
}, (scriptName, annotations, logger) => {
  logger.log('Custom --help message') 
});

cli((options, p1, p2) => {
    console.log('OPTIONS', options)
    console.log('P1', p1)
    console.log('P2', p2)
})
```
