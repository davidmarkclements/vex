## Vex
### A Schema Validator

[![Build Status](https://travis-ci.org/davidmarkclements/vex.svg?branch=master)](https://travis-ci.org/davidmarkclements/vex)

[![Coverage Status](https://img.shields.io/coveralls/davidmarkclements/vex.svg?bust)](https://coveralls.io/r/davidmarkclements/vex?branch=master)

Vex is a handy client side and Node module
that "proofs" an object according to a supplied
schema. 

If the object doesn't satisfy the schema, then
schema is considered "vexed", thus the object
will be rejected.

### Install

#### Node

```sh
npm install vex
```

Then simply require

```
var vex = require('vex');
```

#### Browser
vex.js and vex.min.js are available in the dist folder.
Client-side Vex is a UMD bundle generated with Browserify, 
this means if you're using Require.js or some form of AMD
you can load it as a client-side module using your 
module loader of choice. If not vex is exported to the
global scope as `vex`.

The client code can be generated with 

```
npm run dist
```


### Usage

#### Basic Example

```
var schema = {
  name: String
}


function doSomething(config) {
  vex(config, schema);
  //do stuff
}

```

#### Pinned Schema

```

function doSomething(config) {
  vex(config);
  //do things
}

doSomething.schema = {
  name: String
}

```

#### Optional and Required
```

function doSomething(config) {
  vex(config);
  //do stuff
}

doSomething.schema = {
  opt: {
    name: String,
  },
  req: {
    id: Number
  }
}

```

#### Argument Schemas

```

function doSomething(name, id) {
  vex(arguments);
  //do stuff
}

doSomething.schema = [String, {req:{id: Number}}];

```

#### String Types

#### Special types

#### DOM Types

#### Multiples types

#### Assertion Functions

#### settings.throw

By default Vex will throw if a schema 
hasn't been fulfilled.

We can turn this behaviour off:

```
var vex = require('vex');

var schema = {
	name: String
}

function buildAThing(config) {
	if (vex(config, schema)) {
		//handle error state:
		console.error('oh oh', vex.status())
		return;
	}

	//do stuff
}
```

If a config doesn't satisfy a schema,
vex will return true (to let us know it
has been vexed). This allows us to validate
the schema at the top of the function and
return early if there's a problem (that is
if vex throwing is turned off).

If vex returned false when the schema wasn't
satisfied we'd either have to preceed the
check with a not (!) or otherwise handle
problems at the bottom of the function with 
an else statement - which would create an
extra level of nexting and put error handling
in an unintuitive place (at the bottom).

#### settings.batch

#### settings.NaNIsNum

#### settings.Element & settings.Node

#### settings.labels

#### settings.messages



#### Tests
Tests are written with mocha framework, to run
simply do

```
npm test
```

To run browsers tests install testling
```
npm -g i testling
```
The run testling with the desired browser

For instance, chrome on linux:
```
testling -x google-chrome
```
Or chrome on OS X
```
testling -x open -a 'Google Chrome'
```

### Todo

  * Fill out readme
  * Examples folder
  * Settings tests
  * Fail batching
  * Consider schema label names (opt, req)
  * vex return values?
