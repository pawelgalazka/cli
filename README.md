# CLI ![node version](https://img.shields.io/node/v/%40pawelgalazka%2Fcli.svg) [![Build Status](https://travis-ci.org/pawelgalazka/cli.svg?branch=master)](https://travis-ci.org/pawelgalazka/cli) [![npm version](https://badge.fury.io/js/%40pawelgalazka%2Fcli.svg)](https://badge.fury.io/js/%40pawelgalazka%2Fcli)
Functions based CLI framework

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
Usage: simple.js

Script description
```

You can also add more detailed `help` which will print out info
about options and params:

```js
#!/usr/bin/env node
const { cli, withHelp } = require('@pawelgalazka/cli')

cli(withHelp((options, name = '', surname = '') => {
  console.log(`Hello ${name} ${surname}!`)
  if (options.yay) {
    console.log('YAY!')
  }
}, 'Script description', {
  options: {
    yay: 'print yay'
  },
  params: ['name', 'surname']
}))
```

```sh
$ ./yourScript.js --help
Usage: simple.js [options] [name surname]

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

cli({
  cmd1,
  cmd2
})
```

```sh
$ ./yourScript.js cmd1
First command
```