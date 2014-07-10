var should = require('chai').should();

if (typeof window === 'undefined') {
  global.Element = function Element() {}
  global.Node = function Node() {}
  Element.prototype = new Node;
}

//partially apply vex, allows us to use the .should.throw() syntax
function vex() {
  return vex.module.bind.apply(vex.module, [null].concat([].slice.call(arguments)));
}
vex.module = require('../index.js');
vex.settings = vex.module.settings;

if (typeof window === 'undefined') {
  window = global;
  window.document = require('min-document'); 
  document.documentElement.__proto__.__proto__ = new Element;
  document.createTextNode('').__proto__.__proto__ = new Node;
}

suite('vex')
test('should fail if a target is not supplied', function () {
  vex().should.throw();
})

test('should fail if a schema is not supplied', function () {
  vex({test:'test'}).should.throw();
  vex({a:1}, {a: Number}).should.not.throw();
})

test('should pass with an empty schema', function () {
  vex({test:'test'}, {}).should.not.throw();
})

test('should pass with an empty target and empty schema', function () {
  vex({}, {}).should.not.throw();
})

suite('scheme: String constructor')
test('should validate strings', function () {
  vex({test: 'test'}, {test: String}).should.not.throw();
})
test('should validate empty strings', function () {
  vex({test: ''}, {test: String}).should.not.throw();
})

test('should validate string objects', function () {
  vex({test: new String('test')}, {test: String}).should.not.throw();
  vex({test: new String}, {test: String}).should.not.throw();
})
test('should invalidate non-strings', function () {
  vex({test: {}}, {test: String}).should.throw();
  vex({test: 10}, {test: String}).should.throw();
  vex({test: []}, {test: String}).should.throw();
  vex({test: function(){}}, {test: String}).should.throw();
  vex({test: null}, {test: String}).should.throw();
  vex({test: undefined}, {test: String}).should.throw();
  vex({test: NaN}, {test: String}).should.throw();
})


suite('scheme: Number constructor')
test('should validate numbers', function () {
  vex({test: 1}, {test: Number}).should.not.throw();
})
test('should validate zero', function () {
  vex({test: 0}, {test: Number}).should.not.throw();
})
test('should validate Infinity', function () {
  vex({test: Infinity}, {test: Number}).should.not.throw();

})
test('should validate floats', function () {
  vex({test: 1.28}, {test: Number}).should.not.throw();
  vex({test: Math.PI}, {test: Number}).should.not.throw();
})
test('should validate minus numbers', function () {
  vex({test: -1}, {test: Number}).should.not.throw();
  vex({test: -Infinity}, {test: Number}).should.not.throw();
  vex({test: -Math.PI}, {test: Number}).should.not.throw();
})
test('should validate number objects', function () {
  vex({test: new Number(9)}, {test: Number}).should.not.throw();
  vex({test: new Number(0)}, {test: Number}).should.not.throw();
  vex({test: new Number(Infinity)}, {test: Number}).should.not.throw();
  vex({test: new Number(-9)}, {test: Number}).should.not.throw();
  vex({test: new Number(Math.PI)}, {test: Number}).should.not.throw();
})
test('should invalidate non-numbers', function () {
  vex({test: {}}, {test: Number}).should.throw();
  vex({test: '10'}, {test: Number}).should.throw();
  vex({test: []}, {test: Number}).should.throw();
  vex({test: function(){}}, {test: Number}).should.throw();
  vex({test: null}, {test: Number}).should.throw();
  vex({test: undefined}, {test: Number}).should.throw();
  vex({test: NaN}, {test: Number}).should.throw();
})

suite('scheme: Object constructor')
test('should validate object literals', function () {
  vex({test:{}}, {test: Object}).should.not.throw();
  vex({test:{some:'prop'}}, {test: Object}).should.not.throw();
});
test('should validate objects created with new Object', function () {
  vex({test: new Object}, {test: Object}).should.not.throw();
})
test('should validate objects where the direct ancestor is Object', function () {
  vex({test:Object.create({}, {})}, {test: Object}).should.not.throw();
})

test('should invalidate non-first-level descendants of Object', function () {
  vex({test:[]}, {test: Object}).should.throw();
  vex({test: function(){}}, {test: Object}).should.throw();
  vex({test:Object.create(null, {})}, {test: Object}).should.throw();
  vex({test:Object.create([], {})}, {test: Object}).should.throw();

  function AnotherObjectCtor() {}
  vex({test:new AnotherObjectCtor}, {test: Object}).should.throw();
});

test('should invalidate primitives', function () {
  vex({test:1}, {test:Object}).should.throw();
  vex({test:'test'}, {test:Object}).should.throw();
  vex({test:null}, {test:Object}).should.throw();
  vex({test:undefined}, {test:Object}).should.throw();
  vex({test:NaN}, {test:Object}).should.throw();
})


suite('scheme: Array constructor')
test('should validate array literals', function () {
  vex({test:[1,2,3]}, {test:Array}).should.not.throw();
  vex({test:[]}, {test:Array}).should.not.throw();
})
test('should validate array created with new Array', function () {
  vex({test:new Array}, {test:Array}).should.not.throw();
  vex({test:new Array(10)}, {test:Array}).should.not.throw();
  vex({test:new Array(1,2,3,4)}, {test:Array}).should.not.throw();
})
test('should invalidate array-like objects', function () {
  vex({test:arguments}, {test:Array}).should.throw();
});

test('should invalidate non-arrays', function () {
  vex({test:{}}, {test:Array}).should.throw();
  vex({test:1}, {test:Array}).should.throw();
  vex({test:'test'}, {test:Array}).should.throw();
  vex({test:null}, {test:Array}).should.throw();
  vex({test:undefined}, {test:Array}).should.throw();
  vex({test:NaN}, {test:Array}).should.throw();
})

suite('scheme: Function constructor')
test('should validate function statements', function () {
  function testing(){}
  vex({test:testing}, {test:Function}).should.not.throw();
})

test('should validate function expressions', function () {
  var testing = {method:function test(){}};
  vex({test:function(){}}, {test: Function}).should.not.throw();
  vex({test:testing.method}, {test: Function}).should.not.throw();
})

test('should validate function created with new Function', function () {
  vex({test:new Function}, {test:Function}).should.not.throw();
  
})

test('should validate native methods', function () {
  vex({test: Function.prototype.bind}, {test: Function}).should.not.throw();
  vex({test: Array.prototype.map}, {test: Function}).should.not.throw();
})

test('should invalidate non-function', function () {
  vex({test:{}}, {test:Function}).should.throw();
  vex({test:[]}, {test:Function}).should.throw();
  vex({test:1}, {test:Function}).should.throw();
  vex({test:'test'}, {test:Function}).should.throw();
  vex({test:null}, {test:Function}).should.throw();
  vex({test:undefined}, {test:Function}).should.throw();
  vex({test:NaN}, {test:Function}).should.throw();
})

suite('scheme: RegExp constructor')
test('should validate regular expressions', function () {
  vex({test:/test/}, {test:RegExp}).should.not.throw();
  vex({test:RegExp('test')}, {test:RegExp}).should.not.throw();
  vex({test:new RegExp}, {test:RegExp}).should.not.throw();

})

test('should invalidate non-regexs', function () {
  vex({test:{}}, {test:RegExp}).should.throw();
  vex({test:function(){}}, {test:RegExp}).should.throw();
  vex({test:[]}, {test:RegExp}).should.throw();
  vex({test:1}, {test:RegExp}).should.throw();
  vex({test:'test'}, {test:RegExp}).should.throw();
  vex({test:null}, {test:RegExp}).should.throw();
  vex({test:undefined}, {test:RegExp}).should.throw();
  vex({test:NaN}, {test:RegExp}).should.throw();
})

suite('scheme: Error constructor')
test('should validate Error objects', function () {
  vex({test:Error('test')}, {test:Error}).should.not.throw();
  vex({test:new Error}, {test:Error}).should.not.throw();
})

test('should invalidate non-Error objects', function () {
  vex({test:{}}, {test:Error}).should.throw();
  vex({test:function(){}}, {test:Error}).should.throw();
  vex({test:[]}, {test:Error}).should.throw();
  vex({test:1}, {test:Error}).should.throw();
  vex({test:'test'}, {test:Error}).should.throw();
  vex({test:null}, {test:Error}).should.throw();
  vex({test:undefined}, {test:Error}).should.throw();
  vex({test:NaN}, {test:Error}).should.throw();
})


suite('scheme: Element constructor')
test('should validate DOM elements', function () {
  vex({test: document.createElement('div')}, {test: Element}).should.not.throw();
  vex({test: document.createElement('p')}, {test: Element}).should.not.throw();
  vex({test: document.body}, {test: Element}).should.not.throw();
})

test('should invalidate non DOM Elements (including DOM nodes)', function () {
  vex({test: document.createTextNode('test')}, {test: Element}).should.throw();
  vex({test:{}}, {test:Element}).should.throw();
  vex({test:function(){}}, {test:Element}).should.throw();
  vex({test:[]}, {test:Element}).should.throw();
  vex({test:1}, {test:Element}).should.throw();
  vex({test:'test'}, {test:Element}).should.throw();
  vex({test:null}, {test:Element}).should.throw();
  vex({test:undefined}, {test:Element}).should.throw();
  vex({test:NaN}, {test:Element}).should.throw();
})

suite('scheme: Node constructor')
test('should validate DOM Nodes (including DOM elements)', function () {
  vex({test: document.createTextNode('test')}, {test: Node}).should.not.throw();
  vex({test: document.createElement('div')}, {test: Node}).should.not.throw();
})

test('should invalidate non DOM Nodes', function () {  
  vex({test:{}}, {test:Node}).should.throw();
  vex({test:function(){}}, {test:Node}).should.throw();
  vex({test:[]}, {test:Node}).should.throw();
  vex({test:1}, {test:Node}).should.throw();
  vex({test:'test'}, {test:Node}).should.throw();
  vex({test:null}, {test:Node}).should.throw();
  vex({test:undefined}, {test:Node}).should.throw();
  vex({test:NaN}, {test:Node}).should.throw();
})

suite('scheme: Custom constructors')
test('should validate objects instantiated from non-native constructors', function () {
  function Custom() {}
  vex({test: new Custom}, {test: Custom}).should.not.throw();
})

test('should invalidate values not instantiated from custom constructors', function () {
  function Custom() {}
  vex({test:{}}, {test:Custom}).should.throw();
  vex({test:function(){}}, {test:Custom}).should.throw();
  vex({test:[]}, {test:Custom}).should.throw();
  vex({test:1}, {test:Custom}).should.throw();
  vex({test:'test'}, {test:Custom}).should.throw();
  vex({test:null}, {test:Custom}).should.throw();
  vex({test:undefined}, {test:Custom}).should.throw();
  vex({test:NaN}, {test:Custom}).should.throw();
})


suite('scheme: "string"')
test('should validate strings', function () {
  vex({test: 'test'}, {test: 'string'}).should.not.throw();
})
test('should validate empty strings', function () {
  vex({test: ''}, {test: 'string'}).should.not.throw();
})

test('should validate string objects', function () {
  vex({test: new String('test')}, {test: 'string'}).should.not.throw();
  vex({test: new String}, {test: 'string'}).should.not.throw();
})
test('should invalidate non-strings', function () {
  vex({test: {}}, {test: 'string'}).should.throw();
  vex({test: 10}, {test: 'string'}).should.throw();
  vex({test: []}, {test: 'string'}).should.throw();
  vex({test: function(){}}, {test: 'string'}).should.throw();
  vex({test: null}, {test: 'string'}).should.throw();
  vex({test: undefined}, {test: 'string'}).should.throw();
  vex({test: NaN}, {test: 'string'}).should.throw();

})
suite('scheme: "number"')
test('should validate numbers', function () {
  vex({test: 1}, {test: 'number'}).should.not.throw();
})
test('should validate zero', function () {
  vex({test: 0}, {test: 'number'}).should.not.throw();
})
test('should validate Infinity', function () {
  vex({test: Infinity}, {test: 'number'}).should.not.throw();

})
test('should validate floats', function () {
  vex({test: 1.28}, {test: 'number'}).should.not.throw();
  vex({test: Math.PI}, {test: 'number'}).should.not.throw();
})
test('should validate minus numbers', function () {
  vex({test: -1}, {test: 'number'}).should.not.throw();
  vex({test: -Infinity}, {test: 'number'}).should.not.throw();
  vex({test: -Math.PI}, {test: 'number'}).should.not.throw();
})
test('should validate number objects', function () {
  vex({test: new Number(9)}, {test: 'number'}).should.not.throw();
  vex({test: new Number(0)}, {test: 'number'}).should.not.throw();
  vex({test: new Number(Infinity)}, {test: 'number'}).should.not.throw();
  vex({test: new Number(-9)}, {test: 'number'}).should.not.throw();
  vex({test: new Number(Math.PI)}, {test: 'number'}).should.not.throw();
})
test('should invalidate non-numbers', function () {
  vex({test: {}}, {test: 'number'}).should.throw();
  vex({test: '10'}, {test: 'number'}).should.throw();
  vex({test: []}, {test: 'number'}).should.throw();
  vex({test: function(){}}, {test: 'numbe'}).should.throw();
  vex({test: null}, {test: 'number'}).should.throw();
  vex({test: undefined}, {test: 'number'}).should.throw();
  vex({test: NaN}, {test: 'number'}).should.throw();
})


suite('scheme: "array"')
test('should validate array literals', function () {
  vex({test:[1,2,3]}, {test:'array'}).should.not.throw();
  vex({test:[]}, {test:'array'}).should.not.throw();
})
test('should validate array created with new Array', function () {
  vex({test:new Array}, {test:'array'}).should.not.throw();
  vex({test:new Array(10)}, {test:'array'}).should.not.throw();
  vex({test:new Array(1,2,3,4)}, {test:'array'}).should.not.throw();
})
test('should invalidate array-like objects', function () {
  vex({test:arguments}, {test:'array'}).should.throw();
});

test('should invalidate non-arrays', function () {
  vex({test:{}}, {test:'array'}).should.throw();
  vex({test:1}, {test:'array'}).should.throw();
  vex({test:'test'}, {test:'array'}).should.throw();
  vex({test:null}, {test:'array'}).should.throw();
  vex({test:undefined}, {test:'array'}).should.throw();
  vex({test:NaN}, {test:'array'}).should.throw();
})

suite('scheme: "object"')
test('should validate object literals', function () {
  vex({test:{}}, {test: 'object'}).should.not.throw();
  vex({test:{some:'prop'}}, {test: 'object'}).should.not.throw();
});
test('should validate objects created with new Object', function () {
  vex({test: new Object}, {test: 'object'}).should.not.throw();
})
test('should validate objects where the direct ancestor is Object', function () {
  vex({test:Object.create({}, {})}, {test: 'object'}).should.not.throw();
})

test('should invalidate non-first-level descendants of Object', function () {
  vex({test:[]}, {test: 'object'}).should.throw();
  vex({test:function(){}}, {test: 'object'}).should.throw();
  vex({test:Object.create(null, {})}, {test: 'object'}).should.throw();
  vex({test:Object.create([], {})}, {test: 'object'}).should.throw();

  function AnotherObjectCtor() {}
  vex({test:new AnotherObjectCtor}, {test: 'object'}).should.throw();
});

test('should invalidate primitives', function () {
  vex({test:1}, {test:'object'}).should.throw();
  vex({test:'test'}, {test:'object'}).should.throw();
  vex({test:null}, {test:'object'}).should.throw();
  vex({test:undefined}, {test:'object'}).should.throw();
  vex({test:NaN}, {test:'object'}).should.throw();
})

suite('scheme: "function"')
test('should validate function statements', function () {
  function testing(){}
  vex({test:testing}, {test: 'function'}).should.not.throw();
})

test('should validate function expressions', function () {
  var testing = {method:function test(){}};
  vex({test:function(){}}, {test: 'function'}).should.not.throw();
  vex({test:testing.method}, {test: 'function'}).should.not.throw();
})

test('should validate function created with new Function', function () {
  vex({test:new Function}, {test: 'function'}).should.not.throw();
  
})

test('should validate native methods', function () {
  vex({test: Function.prototype.bind}, {test: 'function'}).should.not.throw();
  vex({test: Array.prototype.map}, {test: 'function'}).should.not.throw();
})

test('should invalidate non-function', function () {
  vex({test:{}}, {test: 'function'}).should.throw();
  vex({test:[]}, {test: 'function'}).should.throw();
  vex({test:1}, {test: 'function'}).should.throw();
  vex({test:'test'}, {test: 'function'}).should.throw();
  vex({test:null}, {test: 'function'}).should.throw();
  vex({test:undefined}, {test: 'function'}).should.throw();
  vex({test:NaN}, {test: 'function'}).should.throw();
})
suite('scheme: "null"')
test('should validate against null values', function () {
  vex({test: null}, {test: 'null'}).should.not.throw();
})
test('should invalidate any non-null values', function () {
  vex({test:function(){}}, {test: 'null'}).should.throw();
  vex({test:[]}, {test: 'null'}).should.throw();
  vex({test:{}}, {test: 'null'}).should.throw();
  vex({test:1}, {test: 'null'}).should.throw();
  vex({test:0}, {test: 'null'}).should.throw();
  vex({test:'test'}, {test: 'null'}).should.throw();
  vex({test:''}, {test: 'null'}).should.throw();
  vex({test:undefined}, {test: 'null'}).should.throw();
  vex({test:NaN}, {test: 'null'}).should.throw();
})
suite('scheme: "undefined"')
test('should validate against undefined values', function () {
  vex({test: undefined}, {test: 'undefined'}).should.not.throw();
  vex({}, {test: 'undefined'}).should.not.throw();
})
test('should invalidate any defined values', function () {
  vex({test:function(){}}, {test: 'undefined'}).should.throw();
  vex({test:[]}, {test: 'undefined'}).should.throw();
  vex({test:{}}, {test: 'undefined'}).should.throw();
  vex({test:1}, {test: 'undefined'}).should.throw();
  vex({test:0}, {test: 'undefined'}).should.throw();
  vex({test:'test'}, {test: 'undefined'}).should.throw();
  vex({test:''}, {test: 'undefined'}).should.throw();
  vex({test:null}, {test: 'undefined'}).should.throw();
  vex({test:NaN}, {test: 'undefined'}).should.throw();
})

suite('scheme: "nan"')
test('should validate against NaN primitives', function () {
  vex({test: NaN}, {test: 'nan'}).should.not.throw();
  vex({test: 0/0}, {test: 'nan'}).should.not.throw();
})

test('should invalidate any value which is not a NaN primitive', function () {
  vex({test:function(){}}, {test: 'nan'}).should.throw();
  vex({test:[]}, {test: 'nan'}).should.throw();
  vex({test:{}}, {test: 'nan'}).should.throw();
  vex({test:1}, {test: 'nan'}).should.throw();
  vex({test:'test'}, {test: 'nan'}).should.throw();
  vex({test:null}, {test: 'nan'}).should.throw();
});

suite('scheme: null')
test('should validate against null values', function () {
  vex({test: null}, {test: null}).should.not.throw();
})
test('should invalidate any non-null values', function () {
  vex({test:function(){}}, {test: null}).should.throw();
  vex({test:[]}, {test: null}).should.throw();
  vex({test:{}}, {test: null}).should.throw();
  vex({test:1}, {test: null}).should.throw();
  vex({test:0}, {test: null}).should.throw();
  vex({test:'test'}, {test: null}).should.throw();
  vex({test:''}, {test: null}).should.throw();
  vex({test:undefined}, {test: null}).should.throw();
  vex({test:NaN}, {test: null}).should.throw();
})

suite('scheme: undefined')
test('should validate against undefined values', function () {
  vex({test: undefined}, {test: undefined}).should.not.throw();
  vex({}, {test: undefined}).should.not.throw();
})
test('should invalidate any defined values', function () {
  vex({test:function(){}}, {test: undefined}).should.throw();
  vex({test:[]}, {test: undefined}).should.throw();
  vex({test:{}}, {test: undefined}).should.throw();
  vex({test:1}, {test: undefined}).should.throw();
  vex({test:0}, {test: undefined}).should.throw();
  vex({test:'test'}, {test: undefined}).should.throw();
  vex({test:''}, {test: undefined}).should.throw();
  vex({test:null}, {test: undefined}).should.throw();
  vex({test:NaN}, {test: undefined}).should.throw();
})

suite('scheme: NaN')
test('should validate against NaN primitives', function () {
  vex({test: NaN}, {test: NaN}).should.not.throw();
  vex({test: 0/0}, {test: NaN}).should.not.throw();
})

test('should invalidate any value which is not a NaN primitive', function () {
  vex({test:function(){}}, {test: NaN}).should.throw();
  vex({test:[]}, {test: NaN}).should.throw();
  vex({test:{}}, {test: NaN}).should.throw();
  vex({test:1}, {test: NaN}).should.throw();
  vex({test:'test'}, {test: NaN}).should.throw();
  vex({test:null}, {test: NaN}).should.throw();
});

suite('scheme: assert function')
test('should be identified as any anonymous function on the schema', function () {
  var anon = function (value) {
    return value < 10 && value > 0;
  }

  vex({test: 5}, {test: anon}).should.not.throw();
  vex({test: 50}, {test: anon}).should.throw();

  vex({test: 5}, {opt: {test: anon}}).should.not.throw();
  vex({test: 50}, {opt: {test: anon}}).should.throw();

  vex({test: 5}, {req: {test: anon}}).should.not.throw();
  vex({test: 50}, {req: {test: anon}}).should.throw();

})
test('should be identified as any function with name matching /assert/i', function () {
  function assert(value) {
    return value < 10 && value > 0;
  }

  vex({test: 5}, {test: assert}).should.not.throw();
  vex({test: 50}, {test: assert}).should.throw();

  vex({test: 5}, {opt: {test: assert}}).should.not.throw();
  vex({test: 50}, {opt: {test: assert}}).should.throw();

  vex({test: 5}, {req: {test: assert}}).should.not.throw();
  vex({test: 50}, {req: {test: assert}}).should.throw();


})
test('should identify any non-anonymous function or function whose name does not match /assert/i as a constructor', function () {
  function someName(value) {
    return value < 10 && value > 0;
  }

  vex({test: 5}, {test: someName}).should.throw();
  vex({test: 50}, {test: someName}).should.throw();

  vex({test: 5}, {opt: {test: someName}}).should.throw();
  vex({test: 50}, {opt: {test: someName}}).should.throw();

  vex({test: 5}, {req: {test: someName}}).should.throw();
  vex({test: 50}, {req: {test: someName}}).should.throw();


})

suite('required scheme sets')
test('should invalidate an object missing one or more required properties', function () {
  vex({}, {req: {test:String}}).should.throw();
  vex({test:'foo'}, {req: {test:String, test2: Number}}).should.throw();
})

test('should validate an object containing all required properties', function () {
  vex({test:'foo'}, {req: {test:String}}).should.not.throw();
  vex({test:'foo', test2: 2}, {req: {test:String, test2: Number}}).should.not.throw();
})


suite('optional scheme sets')
test('should validate an object regardless of whether optional properties are present', function () {
  vex({}, {opt: {test:String}}).should.not.throw();
})

test('should be the default when schema labels are not supplied', function() {
  vex({}, {test:String}).should.not.throw();
})

suite('scheme array')

test('should pass if one of the schemes validate the value', function () {
  vex({test: 22}, {test: [String, Number]}).should.not.throw();
})

suite('multi-level schemas')

test('should vex objects within objects recursively', function () {
  var multi = {test: {
    level1: 'test'
  }};
  var passSchema = {
    test: {
     level1: String
    } 
  };
  var failSchema = {
      test: {
        level1: Number
      }
  }
  
  vex(multi, passSchema).should.not.throw(); 
  vex(multi, failSchema).should.throw(); 

  vex({depth2: multi}, {depth2: passSchema}).should.not.throw(); 
  vex({depth2: multi}, {depth2: failSchema}).should.throw(); 

  vex({depth3: {depth2: multi}}, {depth3: {depth2: passSchema}}).should.not.throw(); 
  vex({depth3: {depth2: multi}}, {depth3: {depth2: failSchema}}).should.throw(); 

  vex({depth4: {depth3: {depth2: multi}}}, {depth4: {depth3: {depth2: passSchema}}}).should.not.throw(); 
  vex({depth4: {depth3: {depth2: multi}}}, {depth4: {depth3: {depth2: failSchema}}}).should.throw();


})

test('should work within required and optional sub-schemas', function () {
  var multi = {
    test: {
      level1: 'test'
    },
    test2: {
      level1: 'test2'
    }
  };
  var passSchema = {
    req: {
      test: {
        level1: String
      }
    },
    opt: {
      test2: {
        level1: String
      }
    }
  };


  //TODO these edge case fail schemas (2 and 3) should
  //probably have seperate tests written, also need to
  //document the behaviour well (require only requires)
  //the first level (e.g. the out object), to require
  //properties within an object needs further req/opts
  //within that object since the sub-object is essentially
  //a sub-schema
  var failSchema1 = {
    req: {
      test: {
        level1: String
      }
    },
    opt: {
      test2: {
        level1: Number
      }
    }
  };

  var failSchema2 = {
    req: {
      test: {
        level1: String,
      },
      nonExistent: Object

    },
    opt: {
      test2: {
        level1: String
      }
    }
  };

  var failSchema3 = {
    req: {
      test: {
        opt: {
          level1: String,  
        },
        
        req: {
          nonExistent: Object  
        }
        
      },

    },
    opt: {
      test2: {
        level1: String
      }
    }
  };

  vex(multi, passSchema).should.not.throw(); 
  vex(multi, failSchema1).should.throw(); 
  vex(multi, failSchema2).should.throw(); 
  vex(multi, failSchema3).should.throw(); 


});


test('should support required and optional schemas within sub-objects', function () {
  var multi = {
    test: {
      optionalProp: 'test',
      requiredProp: 32,

    }
  };
  var passSchema = {
    test: {
      opt: {
        optionalProp: String 
      },
      req: {
        requiredProp: Number
      }
     
    } 
  };

  var failSchema1 = {
    test: {
      opt: {
        optionalProp: Number 
      },
      req: {
        requiredProp: Number
      }
     
    } 
  };

  var failSchema2 = {
    test: {
      opt: {
        optionalProp: String
      },
      req: {
        requiredProp: Number,
        nonExistent: Object
      }
     
    } 
  };

  vex(multi, passSchema).should.not.throw(); 
  vex(multi, failSchema1).should.throw(); 
  vex(multi, failSchema2).should.throw(); 


});


suite('array-like objects')
test('should be succesfully vexed with indexed schema objects', function () {
  function testing(a, b, c) {
    return vex(arguments, {0:String, 1:Number, 2:Object});
  }

  testing('test', 123, {test:true}).should.not.throw();

  testing().should.not.throw();
  testing({test:true}, 123, 'test').should.throw()
  testing('test', {test:true}, 123).should.throw()

})
test('should be succesfully vexed when the schema is an array', function () {
  function testing(a, b, c) {
    return vex(arguments, [String, Number, Object])
  }

  testing('test', 123, {test:true}).should.not.throw();

  testing({test:true}, 123, 'test').should.throw()
  testing('test', {test:true}, 123).should.throw()

})
test('should fail when vexed with array-like schema objects', function () {
  
  function make() {
    var args = arguments;
    return function (a, b, c) {
      return vex(arguments, args);
    }
  }

  testing = make(String, Number, Object);

  testing('test', 123, {test:true}).should.throw();

})


suite('pinned schemas behaviour')
test('should be initiated when vex is not passed a schema and the parent function of the call holds a schema property', function () {
  function testing(config) {
    vex.module(config);
  }

  testing.schema = {
    test: String
  }

  testing.bind(testing, {test:'test'}).should.not.throw();
  testing.bind(testing, {test:22}).should.throw();
})

suite('vex._labelled') 
test('should exit early when available labels array length is zero', function () {

  vex.settings.labels.test = [];
  should.equal(vex.module._labelled({}, 'test'), undefined);
  delete vex.settings.labels.test;

})

suite('settings: throw')
test(' - when true, should throw when schema is vexed', function () {
  vex({test:''}, {test:Number}).should.throw();
})

test(' - when true, should not throw when schema is satisifed', function () {
  vex({test:''}, {test:String}).should.not.throw();
})

test(' - when false, should not throw whether schema is vexed or satisifed', function () {
  var throwDef = vex.settings.throw;

  vex.settings.throw = false;

  vex({test:''}, {test:Number}).should.not.throw();
  vex({test:''}, {test:String}).should.not.throw();

  vex.settings.throw = throwDef;

});

test(' - when false, should return an error object when schema is vexed', function () {
  var throwDef = vex.settings.throw;

  vex.settings.throw = false;
  vex.module({test:''}, {test: Number}).should.be.an.instanceof(Error)
  vex.module({test:''}, {req: {test:Number}}).should.be.an.instanceof(Error)
  vex.module({}, {req: {test:String}}).should.be.an.instanceof(Error)

  vex.settings.throw = throwDef;

})

test(' - when false, should return false when schema is satisifed', function () {
  var throwDef = vex.settings.throw;

  vex.settings.throw = false;
  should.equal(false, vex.module({test:''}, {test: String}))
  should.equal(false, vex.module({test:''}, {required: {test:String}}))

  vex.settings.throw = throwDef;

})

suite('settings: batch')
suite('settings: labels')
suite('settings: messages')
suite('settings: NaNIsNum')
suite('settings: Element')
suite('settings: Node')




