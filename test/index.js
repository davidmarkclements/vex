var vex = require('..');
var should = require('chai').should();

//TODO test/implement 
//  recursion (deep schemas)
// error batching

//binding mechanism, for throws benefit
function vëx() {
  return vex.bind.apply(vex, [null].concat([].slice.call(arguments)));
}

suite('vex')
test('should fail if a target is not supplied', function () {
  vëx().should.throw();
})

test('should fail if a schema is not supplied', function () {
  vëx({test:'test'}).should.throw();
  vëx({a:1}, {a: Number}).should.not.throw();
})

test('should pass with an empty schema', function () {
  vëx({test:'test'}, {}).should.not.throw();
})

test('should pass with an empty target and empty schema', function () {
  vëx({}, {}).should.not.throw();
})

suite('scheme: String constructor')
test('should validate strings', function () {
  vëx({test: 'test'}, {test: String}).should.not.throw();
})
test('should validate empty strings', function () {
  vëx({test: ''}, {test: String}).should.not.throw();
})

test('should validate string objects', function () {
  vëx({test: new String('test')}, {test: String}).should.not.throw();
  vëx({test: new String}, {test: String}).should.not.throw();
})
test('should invalidate non-strings', function () {
  vëx({test: {}}, {test: String}).should.throw();
  vëx({test: 10}, {test: String}).should.throw();
  vëx({test: []}, {test: String}).should.throw();
  vëx({test: function(){}}, {test: String}).should.throw();
  vëx({test: null}, {test: String}).should.throw();
  vëx({test: undefined}, {test: String}).should.throw();
  vëx({test: NaN}, {test: String}).should.throw();
})


suite('scheme: Number constructor')
test('should validate numbers', function () {
  vëx({test: 1}, {test: Number}).should.not.throw();
})
test('should validate zero', function () {
  vëx({test: 0}, {test: Number}).should.not.throw();
})
test('should validate Infinity', function () {
  vëx({test: Infinity}, {test: Number}).should.not.throw();

})
test('should validate floats', function () {
  vëx({test: 1.28}, {test: Number}).should.not.throw();
  vëx({test: Math.PI}, {test: Number}).should.not.throw();
})
test('should validate minus numbers', function () {
  vëx({test: -1}, {test: Number}).should.not.throw();
  vëx({test: -Infinity}, {test: Number}).should.not.throw();
  vëx({test: -Math.PI}, {test: Number}).should.not.throw();
})
test('should validate number objects', function () {
  vëx({test: new Number(9)}, {test: Number}).should.not.throw();
  vëx({test: new Number(0)}, {test: Number}).should.not.throw();
  vëx({test: new Number(Infinity)}, {test: Number}).should.not.throw();
  vëx({test: new Number(-9)}, {test: Number}).should.not.throw();
  vëx({test: new Number(Math.PI)}, {test: Number}).should.not.throw();
})
test('should invalidate non-numbers', function () {
  vëx({test: {}}, {test: Number}).should.throw();
  vëx({test: '10'}, {test: Number}).should.throw();
  vëx({test: []}, {test: Number}).should.throw();
  vëx({test: function(){}}, {test: Number}).should.throw();
  vëx({test: null}, {test: Number}).should.throw();
  vëx({test: undefined}, {test: Number}).should.throw();
  vëx({test: NaN}, {test: Number}).should.throw();
})

suite('scheme: Object constructor')
test('should validate object literals', function () {
  vëx({test:{}}, {test: Object}).should.not.throw();
  vëx({test:{some:'prop'}}, {test: Object}).should.not.throw();
});
test('should validate objects created with new Object', function () {
  vëx({test: new Object}, {test: Object}).should.not.throw();
})
test('should validate objects where the direct ancestor is Object', function () {
  vëx({test:Object.create({}, {})}, {test: Object}).should.not.throw();
})

test('should invalidate non-first-level descendants of Object', function () {
  vëx({test:[]}, {test: Object}).should.throw();
  vëx({test: function(){}}, {test: Object}).should.throw();
  vëx({test:Object.create(null, {})}, {test: Object}).should.throw();
  vëx({test:Object.create([], {})}, {test: Object}).should.throw();

  function AnotherObjectCtor() {}
  vëx({test:new AnotherObjectCtor}, {test: Object}).should.throw();
});

test('should invalidate primitives', function () {
  vëx({test:1}, {test:Object}).should.throw();
  vëx({test:'test'}, {test:Object}).should.throw();
  vëx({test:null}, {test:Object}).should.throw();
  vëx({test:undefined}, {test:Object}).should.throw();
  vëx({test:NaN}, {test:Object}).should.throw();
})


suite('scheme: Array constructor')
test('should validate array literals', function () {
  vëx({test:[1,2,3]}, {test:Array}).should.not.throw();
  vëx({test:[]}, {test:Array}).should.not.throw();
})
test('should validate array created with new Array', function () {
  vëx({test:new Array}, {test:Array}).should.not.throw();
  vëx({test:new Array(10)}, {test:Array}).should.not.throw();
  vëx({test:new Array(1,2,3,4)}, {test:Array}).should.not.throw();
})
test('should invalidate array-like objects', function () {
  vëx({test:arguments}, {test:Array}).should.throw();
});

test('should invalidate non-arrays', function () {
  vëx({test:{}}, {test:Array}).should.throw();
  vëx({test:1}, {test:Array}).should.throw();
  vëx({test:'test'}, {test:Array}).should.throw();
  vëx({test:null}, {test:Array}).should.throw();
  vëx({test:undefined}, {test:Array}).should.throw();
  vëx({test:NaN}, {test:Array}).should.throw();
})

suite('scheme: Function constructor')
test('should validate function statements', function () {
  function testing(){}
  vëx({test:testing}, {test:Function}).should.not.throw();
})

test('should validate function expressions', function () {
  var testing = {method:function test(){}};
  vëx({test:function(){}}, {test: Function}).should.not.throw();
  vëx({test:testing.method}, {test: Function}).should.not.throw();
})

test('should validate function created with new Function', function () {
  vëx({test:new Function}, {test:Function}).should.not.throw();
  
})

test('should validate native methods', function () {
  vëx({test: Function.prototype.bind}, {test: Function}).should.not.throw();
  vëx({test: Array.prototype.map}, {test: Function}).should.not.throw();
})

test('should invalidate non-function', function () {
  vëx({test:{}}, {test:Function}).should.throw();
  vëx({test:[]}, {test:Function}).should.throw();
  vëx({test:1}, {test:Function}).should.throw();
  vëx({test:'test'}, {test:Function}).should.throw();
  vëx({test:null}, {test:Function}).should.throw();
  vëx({test:undefined}, {test:Function}).should.throw();
  vëx({test:NaN}, {test:Function}).should.throw();
})

suite('scheme: RegExp constructor')

suite('scheme: Error constructor')

suite('scheme: Element constructor')

suite('scheme: Custom constructors')


suite('scheme: "string"')
test('should validate strings', function () {
  vëx({test: 'test'}, {test: 'string'}).should.not.throw();
})
test('should validate empty strings', function () {
  vëx({test: ''}, {test: 'string'}).should.not.throw();
})

test('should validate string objects', function () {
  vëx({test: new String('test')}, {test: 'string'}).should.not.throw();
  vëx({test: new String}, {test: 'string'}).should.not.throw();
})
test('should invalidate non-strings', function () {
  vëx({test: {}}, {test: 'string'}).should.throw();
  vëx({test: 10}, {test: 'string'}).should.throw();
  vëx({test: []}, {test: 'string'}).should.throw();
  vëx({test: function(){}}, {test: 'string'}).should.throw();
  vëx({test: null}, {test: 'string'}).should.throw();
  vëx({test: undefined}, {test: 'string'}).should.throw();
  vëx({test: NaN}, {test: 'string'}).should.throw();

})
suite('scheme: "number"')
test('should validate numbers', function () {
  vëx({test: 1}, {test: 'number'}).should.not.throw();
})
test('should validate zero', function () {
  vëx({test: 0}, {test: 'number'}).should.not.throw();
})
test('should validate Infinity', function () {
  vëx({test: Infinity}, {test: 'number'}).should.not.throw();

})
test('should validate floats', function () {
  vëx({test: 1.28}, {test: 'number'}).should.not.throw();
  vëx({test: Math.PI}, {test: 'number'}).should.not.throw();
})
test('should validate minus numbers', function () {
  vëx({test: -1}, {test: 'number'}).should.not.throw();
  vëx({test: -Infinity}, {test: 'number'}).should.not.throw();
  vëx({test: -Math.PI}, {test: 'number'}).should.not.throw();
})
test('should validate number objects', function () {
  vëx({test: new Number(9)}, {test: 'number'}).should.not.throw();
  vëx({test: new Number(0)}, {test: 'number'}).should.not.throw();
  vëx({test: new Number(Infinity)}, {test: 'number'}).should.not.throw();
  vëx({test: new Number(-9)}, {test: 'number'}).should.not.throw();
  vëx({test: new Number(Math.PI)}, {test: 'number'}).should.not.throw();
})
test('should invalidate non-numbers', function () {
  vëx({test: {}}, {test: 'number'}).should.throw();
  vëx({test: '10'}, {test: 'number'}).should.throw();
  vëx({test: []}, {test: 'number'}).should.throw();
  vëx({test: function(){}}, {test: 'numbe'}).should.throw();
  vëx({test: null}, {test: 'number'}).should.throw();
  vëx({test: undefined}, {test: 'number'}).should.throw();
  vëx({test: NaN}, {test: 'number'}).should.throw();
})


suite('scheme: "array"')
test('should validate array literals', function () {
  vëx({test:[1,2,3]}, {test:'array'}).should.not.throw();
  vëx({test:[]}, {test:'array'}).should.not.throw();
})
test('should validate array created with new Array', function () {
  vëx({test:new Array}, {test:'array'}).should.not.throw();
  vëx({test:new Array(10)}, {test:'array'}).should.not.throw();
  vëx({test:new Array(1,2,3,4)}, {test:'array'}).should.not.throw();
})
test('should invalidate array-like objects', function () {
  vëx({test:arguments}, {test:'array'}).should.throw();
});

test('should invalidate non-arrays', function () {
  vëx({test:{}}, {test:'array'}).should.throw();
  vëx({test:1}, {test:'array'}).should.throw();
  vëx({test:'test'}, {test:'array'}).should.throw();
  vëx({test:null}, {test:'array'}).should.throw();
  vëx({test:undefined}, {test:'array'}).should.throw();
  vëx({test:NaN}, {test:'array'}).should.throw();
})

suite('scheme: "object"')
test('should validate object literals', function () {
  vëx({test:{}}, {test: 'object'}).should.not.throw();
  vëx({test:{some:'prop'}}, {test: 'object'}).should.not.throw();
});
test('should validate objects created with new Object', function () {
  vëx({test: new Object}, {test: 'object'}).should.not.throw();
})
test('should validate objects where the direct ancestor is Object', function () {
  vëx({test:Object.create({}, {})}, {test: 'object'}).should.not.throw();
})

test('should invalidate non-first-level descendants of Object', function () {
  vëx({test:[]}, {test: 'object'}).should.throw();
  vëx({test:function(){}}, {test: 'object'}).should.throw();
  vëx({test:Object.create(null, {})}, {test: 'object'}).should.throw();
  vëx({test:Object.create([], {})}, {test: 'object'}).should.throw();

  function AnotherObjectCtor() {}
  vëx({test:new AnotherObjectCtor}, {test: 'object'}).should.throw();
});

test('should invalidate primitives', function () {
  vëx({test:1}, {test:'object'}).should.throw();
  vëx({test:'test'}, {test:'object'}).should.throw();
  vëx({test:null}, {test:'object'}).should.throw();
  vëx({test:undefined}, {test:'object'}).should.throw();
  vëx({test:NaN}, {test:'object'}).should.throw();
})

suite('scheme: "function"')
test('should validate function statements', function () {
  function testing(){}
  vëx({test:testing}, {test: 'function'}).should.not.throw();
})

test('should validate function expressions', function () {
  var testing = {method:function test(){}};
  vëx({test:function(){}}, {test: 'function'}).should.not.throw();
  vëx({test:testing.method}, {test: 'function'}).should.not.throw();
})

test('should validate function created with new Function', function () {
  vëx({test:new Function}, {test: 'function'}).should.not.throw();
  
})

test('should validate native methods', function () {
  vëx({test: Function.prototype.bind}, {test: 'function'}).should.not.throw();
  vëx({test: Array.prototype.map}, {test: 'function'}).should.not.throw();
})

test('should invalidate non-function', function () {
  vëx({test:{}}, {test: 'function'}).should.throw();
  vëx({test:[]}, {test: 'function'}).should.throw();
  vëx({test:1}, {test: 'function'}).should.throw();
  vëx({test:'test'}, {test: 'function'}).should.throw();
  vëx({test:null}, {test: 'function'}).should.throw();
  vëx({test:undefined}, {test: 'function'}).should.throw();
  vëx({test:NaN}, {test: 'function'}).should.throw();
})
suite('scheme: "null"')
test('should validate against null values', function () {
  vëx({test: null}, {test: 'null'}).should.not.throw();
})
test('should invalidate any non-null values', function () {
  vëx({test:function(){}}, {test: 'null'}).should.throw();
  vëx({test:[]}, {test: 'null'}).should.throw();
  vëx({test:{}}, {test: 'null'}).should.throw();
  vëx({test:1}, {test: 'null'}).should.throw();
  vëx({test:0}, {test: 'null'}).should.throw();
  vëx({test:'test'}, {test: 'null'}).should.throw();
  vëx({test:''}, {test: 'null'}).should.throw();
  vëx({test:undefined}, {test: 'null'}).should.throw();
  vëx({test:NaN}, {test: 'null'}).should.throw();
})
suite('scheme: "undefined"')
test('should validate against undefined values', function () {
  vëx({test: undefined}, {test: 'undefined'}).should.not.throw();
  vëx({}, {test: 'undefined'}).should.not.throw();
})
test('should invalidate any defined values', function () {
  vëx({test:function(){}}, {test: 'undefined'}).should.throw();
  vëx({test:[]}, {test: 'undefined'}).should.throw();
  vëx({test:{}}, {test: 'undefined'}).should.throw();
  vëx({test:1}, {test: 'undefined'}).should.throw();
  vëx({test:0}, {test: 'undefined'}).should.throw();
  vëx({test:'test'}, {test: 'undefined'}).should.throw();
  vëx({test:''}, {test: 'undefined'}).should.throw();
  vëx({test:null}, {test: 'undefined'}).should.throw();
  vëx({test:NaN}, {test: 'undefined'}).should.throw();
})

suite('scheme: "nan"')
test('should validate against NaN primitives', function () {
  vëx({test: NaN}, {test: 'nan'}).should.not.throw();
  vëx({test: 0/0}, {test: 'nan'}).should.not.throw();
})

test('should invalidate any value which is not a NaN primitive', function () {
  vëx({test:function(){}}, {test: 'nan'}).should.throw();
  vëx({test:[]}, {test: 'nan'}).should.throw();
  vëx({test:{}}, {test: 'nan'}).should.throw();
  vëx({test:1}, {test: 'nan'}).should.throw();
  vëx({test:'test'}, {test: 'nan'}).should.throw();
  vëx({test:null}, {test: 'nan'}).should.throw();
});

suite('scheme: null')
test('should validate against null values', function () {
  vëx({test: null}, {test: null}).should.not.throw();
})
test('should invalidate any non-null values', function () {
  vëx({test:function(){}}, {test: null}).should.throw();
  vëx({test:[]}, {test: null}).should.throw();
  vëx({test:{}}, {test: null}).should.throw();
  vëx({test:1}, {test: null}).should.throw();
  vëx({test:0}, {test: null}).should.throw();
  vëx({test:'test'}, {test: null}).should.throw();
  vëx({test:''}, {test: null}).should.throw();
  vëx({test:undefined}, {test: null}).should.throw();
  vëx({test:NaN}, {test: null}).should.throw();
})

suite('scheme: undefined')
test('should validate against undefined values', function () {
  vëx({test: undefined}, {test: undefined}).should.not.throw();
  vëx({}, {test: undefined}).should.not.throw();
})
test('should invalidate any defined values', function () {
  vëx({test:function(){}}, {test: undefined}).should.throw();
  vëx({test:[]}, {test: undefined}).should.throw();
  vëx({test:{}}, {test: undefined}).should.throw();
  vëx({test:1}, {test: undefined}).should.throw();
  vëx({test:0}, {test: undefined}).should.throw();
  vëx({test:'test'}, {test: undefined}).should.throw();
  vëx({test:''}, {test: undefined}).should.throw();
  vëx({test:null}, {test: undefined}).should.throw();
  vëx({test:NaN}, {test: undefined}).should.throw();
})

suite('scheme: NaN')
test('should validate against NaN primitives', function () {
  vëx({test: NaN}, {test: NaN}).should.not.throw();
  vëx({test: 0/0}, {test: NaN}).should.not.throw();
})

test('should invalidate any value which is not a NaN primitive', function () {
  vëx({test:function(){}}, {test: NaN}).should.throw();
  vëx({test:[]}, {test: NaN}).should.throw();
  vëx({test:{}}, {test: NaN}).should.throw();
  vëx({test:1}, {test: NaN}).should.throw();
  vëx({test:'test'}, {test: NaN}).should.throw();
  vëx({test:null}, {test: NaN}).should.throw();
});

suite('scheme: assert function')
test('should be identified as any anonymous function on the schema', function () {
  var anon = function (value) {
    return value < 10 && value > 0;
  }

  vëx({test: 5}, {test: anon}).should.not.throw();
  vëx({test: 50}, {test: anon}).should.throw();

  vëx({test: 5}, {opt: {test: anon}}).should.not.throw();
  vëx({test: 50}, {opt: {test: anon}}).should.throw();

  vëx({test: 5}, {req: {test: anon}}).should.not.throw();
  vëx({test: 50}, {req: {test: anon}}).should.throw();

})
test('should be identified as any function with name matching /assert/i', function () {
  function assert(value) {
    return value < 10 && value > 0;
  }

  vëx({test: 5}, {test: assert}).should.not.throw();
  vëx({test: 50}, {test: assert}).should.throw();

  vëx({test: 5}, {opt: {test: assert}}).should.not.throw();
  vëx({test: 50}, {opt: {test: assert}}).should.throw();

  vëx({test: 5}, {req: {test: assert}}).should.not.throw();
  vëx({test: 50}, {req: {test: assert}}).should.throw();


})
test('should identify any non-anonymous function or function whose name does not match /assert/i as a constructor', function () {
  function someName(value) {
    return value < 10 && value > 0;
  }

  vëx({test: 5}, {test: someName}).should.throw();
  vëx({test: 50}, {test: someName}).should.throw();

  vëx({test: 5}, {opt: {test: someName}}).should.throw();
  vëx({test: 50}, {opt: {test: someName}}).should.throw();

  vëx({test: 5}, {req: {test: someName}}).should.throw();
  vëx({test: 50}, {req: {test: someName}}).should.throw();


})

suite('required scheme sets')
test('should invalidate an object missing one or more required properties', function () {
  vëx({}, {req: {test:String}}).should.throw();
  vëx({test:'foo'}, {req: {test:String, test2: Number}}).should.throw();
})

test('should validate an object containing all required properties', function () {
  vëx({test:'foo'}, {req: {test:String}}).should.not.throw();
  vëx({test:'foo', test2: 2}, {req: {test:String, test2: Number}}).should.not.throw();
})


suite('optional scheme sets')
test('should validate an object regardless of whether optional properties are present', function () {
  vëx({}, {opt: {test:String}}).should.not.throw();
})

test('should be the default when schema labels are not supplied', function() {
  vëx({}, {test:String}).should.not.throw();
})

suite('scheme array')

test('should pass if one of the schemes validate the value', function () {
  vëx({test: 22}, {test: [String, Number]}).should.not.throw();
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
  
  vëx(multi, passSchema).should.not.throw(); 
  vëx(multi, failSchema).should.throw(); 

  vëx({depth2: multi}, {depth2: passSchema}).should.not.throw(); 
  vëx({depth2: multi}, {depth2: failSchema}).should.throw(); 

  vëx({depth3: {depth2: multi}}, {depth3: {depth2: passSchema}}).should.not.throw(); 
  vëx({depth3: {depth2: multi}}, {depth3: {depth2: failSchema}}).should.throw(); 

  vëx({depth4: {depth3: {depth2: multi}}}, {depth4: {depth3: {depth2: passSchema}}}).should.not.throw(); 
  vëx({depth4: {depth3: {depth2: multi}}}, {depth4: {depth3: {depth2: failSchema}}}).should.throw();


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

  vëx(multi, passSchema).should.not.throw(); 
  vëx(multi, failSchema1).should.throw(); 
  vëx(multi, failSchema2).should.throw(); 
  vëx(multi, failSchema3).should.throw(); 


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

  vëx(multi, passSchema).should.not.throw(); 
  vëx(multi, failSchema1).should.throw(); 
  vëx(multi, failSchema2).should.throw(); 


});

test.skip('should support a type hinting property for vexing non-object literal objects (like functions)', function () {
  function test() {}
  test.prop = 'test';

  vëx(test, {
    test: {
      type: Function,
      prop: String
    }
  }).should.not.throw();

  vëx(test, {
    test: {
      type: Function,
      prop: Number
    }
  }).should.throw();

  vëx(test, {
    test: {
      type: Function,
      prop: Number
    }
  }).should.throw();


  vëx(test, {
    test: {
      prop: Number
    }
  }).should.throw();


})



test.skip('should support a type hinting property that supports assertion functions as type', function () {

})



suite('array-like objects')
test('should be succesfully vexed with indexed schema objects', function () {
  function testing(a, b, c) {
    return vëx(arguments, {0:String, 1:Number, 2:Object});
  }

  testing('test', 123, {test:true}).should.not.throw();

  testing().should.not.throw();
  testing({test:true}, 123, 'test').should.throw()
  testing('test', {test:true}, 123).should.throw()

})
test('should be succesfully vexed when the schema is an array', function () {
  function testing(a, b, c) {
    return vëx(arguments, [String, Number, Object])
  }

  testing('test', 123, {test:true}).should.not.throw();

  testing({test:true}, 123, 'test').should.throw()
  testing('test', {test:true}, 123).should.throw()

})
test('should fail when vexed with array-like schema objects', function () {
  
  function make() {
    var args = arguments;
    return function (a, b, c) {
      return vëx(arguments, args);
    }
  }

  testing = make(String, Number, Object);

  testing('test', 123, {test:true}).should.throw();

})


suite('pinned schemas behaviour')
test('should be initiated when vex is not passed a schema and the parent function of the call holds a schema property', function () {
  function testing(config) {
    vex(config);
  }

  testing.schema = {
    test: String
  }

  testing.bind(testing, {test:'test'}).should.not.throw();
})

suite('settings: throw')
suite('settings: batch')
suite('settings: labels')
suite('settings: NaNIsNum')






