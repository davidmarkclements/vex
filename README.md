### Vex
#### A Schema Validator

Vex is a handy client side and Node module
that "proofs" an object according to a supplied
schema. 

If the object doesn't satisfy the schema, then
schema is considered "vexed", thus the object
will be rejected.

#### Usage

Intead of doing this

```
function buildAThing(config) {
  if (typeof config.name === 'string') {
    //do stuff
  } else {
    throw 'buildAThing config needs a name property that\'s a string'
  }

}
```

We can do this,

```
var vex = require('vex');

var schema = {
  name: String
}


function buildAThing(config) {
  vex(config, schema);
  //do stuff
}

```

By default Vex will throw if a schema 
hasn't been fulfilled.

We can turn this behaviour off:

```
var vex = require('vex');
vex.does.not.throw();

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





