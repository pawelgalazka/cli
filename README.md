# microcli ![node version](https://img.shields.io/node/v/microcli.svg) [![Build Status](https://travis-ci.org/pawelgalazka/microcli.svg?branch=master)](https://travis-ci.org/pawelgalazka/microcli) [![npm version](https://badge.fury.io/js/microcli.svg)](https://badge.fury.io/js/microcli)
CLI scripts micro engine

``` js
#!/usr/bin/env node
const cli = require('microcli')(process.argv);
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
