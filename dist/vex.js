!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.vex=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
var settings = {
  labels: {
    required: ['req', '&'],
    optional: ['opt', '|'],
    illegal: ['ill', '!'],
    assert: /assert/i
  },
  messages: {
    required: function (key) { 
      return key + ' is a required property';
    },
    mismatch: function (key, type) { 
      return key + ' doesn\'t match ' + type; 
    }
  },
  throw: true,
  batch: false,
  NaNIsNum: false,
  Element: typeof Element !== 'undefined' ? Element : null,
  Node: typeof Node !== 'undefined' ? Node : null

};

function fetchSchemaSet(schema, label) {
  if (!schema) {return;}
  var labels = settings.labels[label];
  if (typeof labels === 'string') {return labels;}
  
  var i = labels.length;
  var schemaSet;

  if (i <= 0) {return;}
  while(i--) {
    schemaSet = schema[labels[i]];
    if (schemaSet) {break;}
  }
  return schemaSet;
}

function fetchMessage(key, type, messageType) {
  var message = settings.messages[messageType];
  if (!message) {return '';}
  if (message instanceof Function) {
    return message(key, type);
  }
  return key + message + type;
}

function is(value, type) {
  var ctor, typeofValue = value === null ? 'null' : typeof value;

  //Element and Node are special cases, where we check
  //for instanceof (e.g. multi-level inheritance)
  //instead of the immediate constructor only
  if (settings.Element && type === settings.Element) {
    return value instanceof type;
  }
  if (settings.Node && type === settings.Node) {
    return value instanceof type;
  }
  
  //if the type is an object literal,
  //this must be another schema
  if (type && type.constructor === Object && !vex(value, type)) {
    type = Object; 
  }

  type = Number.isNaN(type) ? 'nan' : type;
  if (type && !settings.NaNIsNum && !!type.toLowerCase && type.toLowerCase() === 'nan') {
    return Number.isNaN(value)
  }

  if (!settings.NaNIsNum && Number.isNaN(value)) {
    return type && !!type.toLowerCase && type.toLowerCase() === 'nan';
  }

  if (Array.isArray(type)) {
    return type.some(function(t) {return is(value, t);});
  }

  if (type instanceof Function) {
    if (!type.name || settings.labels.assert.test(type.name)) {
      return type(value);
    }

    return value !== null && 
      value !== undefined && 
      value.constructor === type;  
  }

  if (!type) {
    type = type === null ? 'null' : typeof type;
  }

  if (typeof type === 'string') {
    
    ctor = type.substring(0,1).toUpperCase() + type.substring(1);

    if (global[ctor] instanceof Function) {
      return is(value, global[ctor]);
    }

    return (typeofValue === type);
  }
}

function invalidate(target, schema, requiring) {
  if (!target || !schema) {return;}
  var properties = Object.getOwnPropertyNames(schema);

  var i = properties.length;
  var key;
  if (i <= 0) {return;}
  while (i--) {
    key = properties[i];
    if (!key) {continue;}
    if (requiring && !(key in target)) {
      return {
        key: key,
        reason: 'required'
      };
    }

    if ((key in target) && !is(target[key], schema[key])) {
      return {
        key: key,
        type: schema[key] && schema[key].name || schema[key],
        reason: 'mismatch'
      };
    }

  }
}

function error(key, reason) {
  return Error('Schema has been vexed: "' + reason);
}

function vexed(invalid) {
  var key = invalid.key;
  var type = invalid.type;
  var reason = invalid.reason;
  if (!key) {return;}

  var err = error(key, fetchMessage(key, type, reason));

  if (settings.vexed instanceof Function) {
    return settings.vexed(err);
  }

  return err;  
}

function vex(target, schema) {
  if (!target) {
    throw Error('vex needs a target object to apply the schema to');
  }
  schema = schema || vex.caller.schema;
  if (!schema) {
    throw Error('vex needs a schema, either as second parameter or as a property function from which it was called');
  }
  if (Array.isArray(schema)) {
    schema = schema.reduce(function(o, type, ix) {
      o[ix] = type;
      return o;
    }, {});
  }

  var required = fetchSchemaSet(schema, 'required');
  var optional = fetchSchemaSet(schema, 'optional');
  var err;

  if (!required) {
    optional = optional || schema;
  }

  var invalid = invalidate(target, required, true);

  if (invalid) { 
    err = vexed(invalid);
    if (settings.throw) { throw err; }
    return err;
  }

  invalid = invalidate(target, optional);

  if (invalid) {
    err = vexed(invalid);
    if (settings.throw) { throw err; }
    return err;
  }

  return false;
}

vex.settings = settings;
vex.is = is;

module.exports = vex;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])
(1)
});