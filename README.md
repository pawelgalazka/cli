# CLI ![node version](https://img.shields.io/node/v/%40pawelgalazka%2Fcli.svg) [![Build Status](https://travis-ci.org/pawelgalazka/cli.svg?branch=master)](https://travis-ci.org/pawelgalazka/cli) [![npm version](https://badge.fury.io/js/%40pawelgalazka%2Fcli.svg)](https://badge.fury.io/js/%40pawelgalazka%2Fcli)
Functions based CLI framework

## Quick Start

```sh
$ npm install @pawelgalazka/cli --save
```

`yourScript.js`:
```js
#!/usr/bin/env node
const { cli } = require('@pawelgalazka/cli')

cli((options, name = '', surname = '') => {
  console.log(`Hello ${name} ${surname}!`)
  console.log('Options:', options)
})
```

```sh
$ chmod a+x ./yourScripts # add execute permissions
$ ./yourScript.js Pawel Galazka --someOption
Hello Pawel Galazka!
Options: { someOption: true }
```
