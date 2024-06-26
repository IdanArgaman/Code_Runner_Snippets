/* eslint-disable */

const CodeTypesEnum = {
  ARRAYS: "ARRAYS",
  TRICKS: "TRICKS",
  PATTERNS: "PATTERNS",
  ES6: "ES6",
  BLACK_BELT: "BLACK-BELT",
};

export default [
  {
    categoryId: CodeTypesEnum.BLACK_BELT,
    title: "Promises sync",
    description: `We have a some background operations that finish at different times,
    we want to execute code when all of them gets finished!`,
    code: () => {
      const number_of_requests = 10;

      // Background operation resolved within 1 second
      const mkDb = () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(), Math.floor(Math.random() * 1000))
        );

      // A colsue - encapsulating a single promise that gets resolved
      // only when the closure gets called a defined number of times!
      const sync = ((num) => {
        let internal_resolve = null;
        let call_count = 0;

        const internal_promise = new Promise(
          // Saving the promise resolve function at the closure context
          (resolve) => (internal_resolve = resolve)
        );

        return () => {
          call_count++;
          // Call number reached - resolve!
          if (call_count === num) {
            internal_resolve();
          }

          // return the closure promise!
          return internal_promise;
        };
      })(number_of_requests);

      // Call many background operations
      // The problem is that we don't want this code to used aysnc await!
      // From this function's point of view, cb is not even async!
      const times = (num, cb) => {
        for (let i = 0; i < num; i++) {
          cb();
        }
      };

      const arr_times = [];

      times(number_of_requests, async () => {
        await mkDb();

        // This is the implementation core, we are awaiting on a single promise
        // handled by the closure
        await sync();

        arr_times.push(new Date().getTime());

        if (arr_times.length === number_of_requests) {
          const diff = arr_times[number_of_requests - 1] - arr_times[0];
          console.log(diff < 10 ? "Success" : "Failure");
        }
      });
    },
  },
  {
    categoryId: "Snippet",
    title: "",
    description: "",
    code: () => {
      // Reference: https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261

      // A cancellable promise utility that you can use to wrap any promise
      // for example, to handle network requests
      // speculation(fn: SpecFunction, shouldCancel: Promise) => Promise

      const speculation = (
        // This is the handler function the user
        // passes to the promise, this handler function
        // will recieve the regular "resolve" and "reject" but also onCancel
        fn,
        // The use provides a cancel promise
        // when the user will resolve it the handleCancel will be called
        cancel = Promise.reject() // Don't cancel by default
      ) =>
        new Promise((resolve, reject) => {
          // On cancel is a function that takes a function that
          // will be called when the cancel promise gets resolved
          const onCancel = (handleCancel) =>
            cancel
              .then(
                handleCancel,
                // Ignore expected cancel rejections
                () => {}
              )
              // handle onCancel errors
              .catch((e) => reject(e));

          // fn is provided with the regular resolve, reject, but also onCancel callback
          // that will be called when the provided cancel promise is resolved
          fn(resolve, reject, onCancel);
        });

      // We want the caller to wait to be able to cancel it!
      const wait = (
        time,
        // The user should provide a promise that when resolved
        // it would cancel the operation! We listen to this cancel token.
        cancel = Promise.reject()
      ) =>
        speculation(
          (
            resolve,
            reject,
            // speculation wrapps a promise so it provides our function a resolve
            // and reject function as regular but also an onCancel handler
            // that will be called when the user decided to resolve its cancel promise
            onCancel
          ) => {
            // Simulate an async process - this is the operation's body
            const timer = setTimeout(resolve, time);

            // Provide onCancel callback with handler!
            // When the cancel promise gets resolved - this function would be called!
            onCancel(() => {
              clearTimeout(timer);
              reject(new Error("Cancelled"));
            });
          },
          // The cancellation promise is passed to speculation
          // when resolved, onCancel will be called
          cancel
        );

      // USE

      // The cancel token will be resolved in 500 seconds
      wait(
        200,
        wait(500) /* this call to wait is not provided with a cancel token */
      ).then(
        () => console.log("Hello!"),
        (e) => console.log(e)
      ); // 'Hello!'

      wait(200, wait(50)).then(
        () => console.log("Hello!"),
        (e) => console.log(e)
      ); // [Error: Cancelled]
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Modern Memoize",
    description: "",
    code: () => {
      function memoize(f) {
        var memo = {};
        return function(...args) {
          var mkey = JSON.stringify(args);
          if (!(mkey in memo)) {
            console.log("Calculated!");
            memo[mkey] = f.apply(this, args);
          } else {
            console.log("from cache!");
          }
          return memo[mkey];
        };
      }

      const fnMemoize = memoize((x, y, z) => x * y * z);

      fnMemoize(1, 2, 3);
      fnMemoize(1, 2, 3);
      fnMemoize(4, 5, 6);
      fnMemoize(4, 5, 6);
      fnMemoize(4, 5, 6);
      fnMemoize(7, 8, 9);
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Meomize at the prototype level",
    description: "",
    code: () => {
      Function.prototype.mkMemoize = function() {
        var memo = {};

        // this in the function we called memoize on!
        var fn = this;
        return function(...args) {
          var mkey = JSON.stringify(args);

          // Safer to use 'in' instead of indxer operator which would fail the check if the value is falsy
          if (!(mkey in memo)) {
            console.log("Calculated!");

            // Important to use this here in order to allow 'bind' to work
            memo[mkey] = fn.apply(this, args);
          } else {
            console.log("from cache!");
          }
          return memo[mkey];
        };
      };

      function simpleCalc(x, y, z) {
        return x * y * z;
      }

      simpleCalc(1, 2, 3);

      simpleCalcMemoize = simpleCalc.mkMemoize();

      simpleCalcMemoize(1, 2, 3);
      simpleCalcMemoize(1, 2, 3);
      simpleCalcMemoize(4, 5, 6);
      simpleCalcMemoize(4, 5, 6);
      simpleCalcMemoize(4, 5, 6);
      simpleCalcMemoize(7, 8, 9);
      simpleCalcMemoize(7, 8, 9);

      var person = {
        x: 1,
        y: 2,
      };

      simpleCalcMemoize.bind(person)(7, 8, 9);
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Private members simulation",
    description:
      "Simluate private instance members by a single shared WeakMap resource",
    code: () => {
      var Thing;

      {
        // We should note that the private WeakMap is ❗❗❗ SHARED ❗❗❗ between instances of Thing.
        let privateScope = new WeakMap(); // can't be accessed outside the block, because we are using the ❗❗❗'let'❗❗❗ keyword!
        let counter = 0;

        Thing = function() {
          this.someProperty = "foo";

          // Accessing the shared WeakMap, the key is "this" which is the currently created
          // object instance. This "this" value is unique so it serves us as a unique place
          // in the shared WeakMap resource
          privateScope.set(this, {
            hidden: ++counter,
          });
        };

        Thing.prototype.showPublic = function() {
          return this.someProperty;
        };

        Thing.prototype.showPrivate = function() {
          return privateScope.get(this).hidden; // Using our weak map
        };
      }

      // Because we are using 'let' in our definition above, we can't
      // access these members!
      console.log("privateSscope:", typeof privateScope); // "undefined"
      console.log("counter:", typeof counter); // "undefined"

      var thing = new Thing();

      // Thing {someProperty: "foo"}
      // Note that we can't see "hidden" in the console!
      console.log(thing);

      console.log(thing.showPublic()); // "foo"
      console.log(thing.someProperty); // "foo" -> direct access

      console.log(thing.showPrivate()); // 1
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Abstract class simulation",
    description: "Using the new.target ES6 feature",
    code: () => {
      /* The new.target property lets you detect whether a function or constructor was called using 
               the new operator. In constructors and functions instantiated with the new operator, 
               new.target returns a reference to the constructor or function. In normal function calls, 
               new.target is undefined */

      class Note {
        constructor() {
          if (new.target === Note) {
            /* Did the Note consturctor was used ??? */
            throw new Error("Note cannot be directly constructed.");
          }
        }
      }

      class ColorNote extends Note {}

      try {
        let note = new Note(); // error!
      } catch (e) {
        console.log(e);
      }

      let colorNote = new ColorNote(); // ok
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Timed out promise",
    description: "Simulating a timed out promise using Promise.race",
    code: () => {
      // Reference: https://advancedweb.hu/how-to-add-timeout-to-a-promise-in-javascript/
      class ValidationError extends Error {
        constructor(message) {
          super(message);
          this.name = "ValidationError";
        }
      }

      // Wrap "setTimeout" in a promise such that if
      // the timeout completes, the promise is rejected

      const timeout = (delay = 30000) => {
        return new Promise((resolve, reject) => {
          let rejectWithError = () => {
            reject(new ValidationError("Timed out!"));
          };

          setTimeout(rejectWithError, delay);
          // Also: setTimeout(reject, delay, new ValidationError("Timed out!"));
        });
      };

      // Return a promise that will be fulfilled if
      // the fetch is fulfilled before the timeout
      // is rejected.

      const fetchWithTimeout = (url, delay = 3000) => {
        // construct an array to pass to `Promise.race`
        // !!!!!!!!!!!!!NOTE!!!!!!!!!!!!
        return Promise.race([fetch(url), timeout(delay)]);
      };

      // Make an XHR request for the URL that has to
      // return a response *before* the 1 s timeout
      // happens

      fetchWithTimeout("/json/data.json", 1000)
        .then((response) => {
          // successful response before the 1 s timeout
          console.log("successful response", response);
        })
        .catch((e) => {
          // Either the timeout occurred or some other error.
          // Would need to check the method or use a custom
          // `Error` subclass in `timeout`
          if (e instanceof ValidationError) {
            console.error("Time Out!", e);
          } else {
            console.error("Request Error", e);
          }
        });
    },
  },
  {
    categoryId: CodeTypesEnum.TRICKS,
    title: "",
    description: "",
    code: () => {
      // Lazy range function that emits value only when needed

      function* range(start, count) {
        for (let delta = 0; delta < count; delta++) {
          yield start + delta;
        }
      }

      for (let teenageYear of range(13, 7)) {
        console.log(`Teenage angst @ ${teenageYear}!`);
      }
    },
  },
  {
    categoryId: CodeTypesEnum.TRICKS,
    title: "Enforcing maximum number of params",
    description: "Using the spread operator to detect extra parameters",
    code: () => {
      function max(a, b, c, ...shouldBeEmpty) {
        if (shouldBeEmpty.length > 0) throw Error("max 3 parameters allowed!");

        return Math.max(a, b, c);
      }

      // not an error
      // output 6
      max(4, 5, 6);

      // error!
      max(4, 5, 6, 7);
    },
  },
  {
    categoryId: CodeTypesEnum.TRICKS,
    title: "Enforcing required parameters",
    description: "Enforcing paramters with default value trick",
    code: () => {
      const required = () => {
        throw new Error("Missing parameter");
      };

      // The below function will throw an error if either "a" or "b" is missing.
      // We should note that the function gets executed when the parameter is missing
      // so the default value (the function) in this situtation executes.
      const add = (a = required(), b = required()) => a + b;

      add(1, 2); // 3

      add(1); // Error: Missing parameter.
    },
  },
  {
    categoryId: CodeTypesEnum.TRICKS,
    title: "Using reduce as filter and map",
    description: "",
    code: () => {
      const numbers = [10, 20, 30, 40];
      const doubledOver50 = numbers.reduce((
        finalList /* accamulator */,
        num
      ) => {
        // double each number (i.e. map)
        num = num * 2;

        // filter number > 50
        if (num > 50) {
          finalList.push(num);
        }

        return finalList;

        // Note that the accmulator is an empty array
      }, []);

      console.log(doubledOver50); // [60, 80]
    },
  },
  {
    categoryId: CodeTypesEnum.TRICKS,
    title: "Using reduce to create a count map",
    description: "",
    code: () => {
      var cars = ["BMW", "Benz", "Benz", "Tesla", "BMW", "Toyota"];
      var carsObj = cars.reduce(function(obj, name) {
        obj[name] = obj[name] ? ++obj[name] : 1;
        return obj;
        // Note that we initialize the accumulator to be an empty object
      }, {});

      console.log(JSON.stringify(carsObj)); // => { BMW: 2, Benz: 2, Tesla: 1, Toyota: 1 }
    },
  },
  {
    categoryId: CodeTypesEnum.TRICKS,
    title: "Remove unwanted properties from an object",
    description: "",
    code: () => {
      let { _internal, tooBig, ...cleanObject } = {
        el1: "1",
        _internal: "secret",
        tooBig: {},
        el2: "2",
        el3: "3",
      };

      console.log(JSON.stringify(cleanObject)); // {el1: '1', el2: '2', el3: '3'}
    },
  },
  {
    categoryId: CodeTypesEnum.ES6,
    title: "ES6",
    description: "",
    code: () => {
      (() => {
        //////////////////////
        /* Class Expression */
        //////////////////////

        /* A class signature from MDN:
    
                    var MyClass = class [className] [extends] {
                        // class body
                    };
    
                    So, we can see that the class name is not mandatory
                */

        var Rectangle = class /* note no name */ {
          constructor(height, width) {
            this.height = height;
            this.width = width;
          }
          area() {
            return this.height * this.width;
          }
        };
      })();

      (() => {
        /////////////////////////////////////////////
        /* Using array.entries to simulate forEach */
        /////////////////////////////////////////////

        const arr = ["a", "b", "c"];
        for (const [index, elem] of /* Note */ arr.entries()) {
          console.log(`index = ${index}, elem = ${elem}`);
        }
      })();

      (() => {
        //////////
        // Swap //
        //////////

        let param1 = 1;
        let param2 = 2;
        [param1, param2] = [param2, param1];
        console.log(param1); // 2
        console.log(param2); // 1
      })();

      (() => {
        /////////////////////////////////////////////////
        /* Remove dups from array with the help of Set */
        /////////////////////////////////////////////////

        let MyArray = [1, 1, 2, 2, 3, 3];
        let deduped = [...new Set(MyArray)]; // [1, 2, 3] -> Set's constructor accepts an array
        console.log(deduped);
      })();

      (() => {
        //////////////////
        /* Native Range */
        //////////////////

        [...Array(5).keys()];
      })();

      (() => {
        // Flattening an array with reduce
        [
          [1, 2, 3],
          [4, 5],
          [6, 7, 8, 9],
        ].reduce((arr, subArr) => arr.concat(subArr), []);
      })(() => {
        ////////////////////////////
        /* Dynamic Property Names */
        ////////////////////////////

        let city = "sheffield_";

        let a = {
          [city + "population"]: 350000,
        };

        a[city + "county"] = "South Yorkshire";

        console.log(a);
      })();

      (() => {
        ////////////////////////
        /* Nested Destructing */
        ////////////////////////

        const user = {
          id: 339,
          name: "Fred",
          age: 42,
          education: {
            degree: "Masters",
          },
        };

        const {
          education: {
            degree, // Note!
          },
        } = user;

        console.log(degree); // Masters
      })();

      (() => {
        //////////////////////////////////////////
        /* Log variable with its name and value */
        //////////////////////////////////////////

        let myVar = "foo";

        // output:
        // {myVar: "foo"}
        console.log({
          myVar,
        });
      })();
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Mixin pattern with classes",
    description: "Create a mixin functionality with classes and extend",
    code: () => {
      // This is a function that returns class that extend the supplied class by adding a save method
      // Note that we return a class with no name, we can assig to variable or to other "extends" keyword
      const Storage = (Sup) =>
        /* 👍 anonymous class */ class extends Sup {
          save(database) {}
        };

      // This is a function that returns class that extend the supplied class by
      // adding a validate method
      const Validation = (Sup) =>
        class extends Sup {
          validate(schema) {}
        };

      class Person {}

      // Applying mixins on Person
      class Employee extends Storage(Validation(Person)) {}
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Native currying with bind",
    description:
      "Using bind we can also not just enforce 'this' instance but also supply arguments with values",
    code: () => {
      /* 
                JS supports native currying pattern:
                ------------------------------------
                We can use of bind() is to make a function with pre-specified initial arguments. 
                These arguments (if any) follow the provided this value and are then inserted at 
                the start of the arguments passed to the target function, followed by the arguments
                passed to the bound function, whenever the bound function is called
            */

      function list() {
        return Array.prototype.slice.call(arguments);
      }

      // Regular usage
      console.log(list(1, 2, 3)); // [1, 2, 3]

      // Create a function with a PRESET leading argument
      // The first argument to "leadingThirtysevenList" is 37 NO matter what we provide
      var leadingThirtysevenList = list.bind(null, 37);

      console.log(leadingThirtysevenList()); // [37]
      console.log(leadingThirtysevenList(1, 2, 3)); // [37, 1, 2, 3]

      /*---------------------*/

      function addArguments(arg1, arg2) {
        return arg1 + arg2;
      }

      console.log(addArguments(1, 2));

      var addThirtySeven = addArguments.bind(null, 37);

      // 37 + 5 = 42 => 5 is assigned to "arg2" argument
      console.log(addThirtySeven(5));

      // 37 + 5 = 42 =>  5 is assigned to "arg2" argument, the second argument is ignored
      console.log(addThirtySeven(5, 10));
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Singleton",
    description: "",
    code: () => {
      var Singleton = (function() {
        var instance;

        function createInstance() {
          var object = new Object("I am the instance");
          return object;
        }

        return {
          getInstance: function() {
            if (!instance) {
              instance = createInstance();
            }
            return instance;
          },
        };
      })();

      var instance1 = Singleton.getInstance();
      var instance2 = Singleton.getInstance();
      console.log("Same instance? " + (instance1 === instance2));
    },
  },
  {
    categoryId: CodeTypesEnum.ARRAYS,
    title: "Array tricks",
    description:
      "We are exploiting the fact that apply takes an array of arguments",
    code: () => {
      var array = ["a", "b"];
      var elements = [0, 1, 2];

      // Concat

      // Because "apply" accepts an array to be provided as a second paramenter
      // the elements array are treated as 3 different arguments that are just enclosed
      // into an array.

      array.push.apply(array, elements);
      console.log(array);

      // Min/Max
      var numbers = [5, 6, 2, 3, 7];

      console.log(Math.max.apply(null, numbers));
      console.log(Math.min.apply(null, numbers));

      // OR ES6 Way

      console.log(Math.max(...numbers));
      console.log(Math.min(...numbers));
    },
  },
  {
    categoryId: CodeTypesEnum.BLACK_BELT,
    title: "Binding the apply function itself",
    description: "What happens when we bind the apply function itself?",
    code: () => {
      /*
                How "apply" works? apply is a function that invokes the function that it was called from.
                We may guess that apply invokes the function it is applied on by accessing that function using "this"
                inside "apply" implementation. So:
                
                slice.apply -> inside "apply" body, "slice" is accessed by using "this", so we can guess that
                "slice" gets invoked by calling "this()".

                We should not forget "apply" main purpose, to allow "this" and arguments binding.
                
            */

      var myFunc = function() {
        console.log("inside myFunc", this, JSON.stringify(this));
      };

      // Let's bind apply to myFunc, so we new got a new "apply" function that inside it,
      // ---> "this" <--- will be myFunc!

      var apply_bound_to_my_func = Function.prototype.apply.bind(myFunc);

      // apply_bound_to_my_func is the "apply" function in disguise, we still need provide it with a
      // "this" argument as "apply" expects.

      apply_bound_to_my_func({
        length: 2,
        0: "idan",
        1: "argaman",
      });

      /*
                Summary:
                "apply" executes the function accessed by "this" in its body,
                we bound "apply" to myFunc so "this" is myFunc inside apply's body.
                "apply" will execute myFunc by calling this().
                Apply gets a first argument to serve as "this" inside the function it executes. 
                So "this" inside myFunc (this()) is the object we passed.
            */
    },
  },
  {
    categoryId: CodeTypesEnum.BLACK_BELT,
    title: "Creating our own version of call",
    description: "",
    code: () => {
      // We need to assign to assign "someOtherThis" as "this" in the function's
      // body. So we attach the function as a property of "someOtherThis" and
      // call it from "someOtherThis" as a method call.

      Function.prototype.myOwnCall = function(someOtherThis, ...otherArgs) {
        const symbol1 = Symbol();

        // "this" is the function myOwnCall was invoked from, which is the function
        // we want to invoke with the "this" in it pointing to someOtherThis.

        someOtherThis[symbol1] = this || global;

        // Before ES6 we had no spread operator, so we needed to build a comman separted list of arguments,
        // and invoke the function using eval!

        /*
                    var args = [];

                    for (var i = 1, len = arguments.length; i < len; i++) {
                    args.push("arguments[" + i + "]");
                    }

                    const result = eval("someOtherThis[symbol1](" + args + ")");
                */

        // Invoking the function stored at "symbol1" through "someOtherThis"
        // ensures the "this" inside that function will be "someOtherThis"

        const result = someOtherThis[symbol1](...otherArgs);
        delete someOtherThis[symbol1];
        return result;
      };

      function testme() {
        console.log(
          `this.name: ${this.name}, arguments: ${JSON.stringify(arguments)}`
        );
      }

      testme.myOwnCall(
        {
          name: "Idan",
          hobby: "Coding",
        },
        1,
        2,
        3
      );
    },
  },
  {
    categoryId: CodeTypesEnum.BLACK_BELT,
    title: "Creating our own version of apply",
    description: "",
    code: () => {
      Function.prototype.myOwnApply = function(someOtherThis, ...otherArgs) {
        someOtherThis = someOtherThis || global;

        const symbol1 = Symbol();

        someOtherThis[symbol1] = this; // 'this" === the function "myOwnApply" was called on!
        var result = null;

        // Before ES6 we had no spread operator, so we needed to build a comman separted list of arguments,
        // and invoke the function using eval!
        /*
                if (!arr) {
                    // Direct invoke instead of "eval" if there are no arguments

                    // Invoking the function stored in "symbol1' (which is the function "myOwnApply" was called on) through an object,
                    // makes the "this" value inside that function to be that object!
                    result = someOtherThis[symbol1]();
                } else {
                    // Use "eval" to invoke to command string
                    for (let i = 1, len = arr.length; i < len; i++) {
                        args.push("arr[" + i + "]");
                    }
                    result = eval("someOtherThis[symbol1](" + args + ")");
                }*/

        result = someOtherThis[symbol1](...otherArgs);
        delete someOtherThis[symbol1];
        return result;
      };

      function test(a, b) {
        return this.x + this.y + a + b;
      }

      console.log(
        test.myOwnApply(
          {
            x: 1,
            y: 2,
          },
          3,
          4
        )
      );
    },
  },
  {
    categoryId: CodeTypesEnum.BLACK_BELT,
    title: "Our own version of bind",
    description: "",
    code: () => {
      Function.prototype.myOwnBind = function(newThis, ...otherArgs) {
        // Good error checking!
        if (typeof this !== "function") {
          throw new Error(this + "cannot be bound as it's not callable");
        }

        // The original function to call
        var boundTargetFunction = this;

        // Before ES6:
        // Convert arguments to a real array and omit the first item (which is "this")
        // var boundArguments = Array.prototype.slice.call(arguments, 1);

        return function boundFunction(...newArgs) {
          // Before ES6
          // here the arguments refer to the second time when we call the target function returned from bind
          //var targetArguments = Array.prototype.slice.call(arguments);

          return boundTargetFunction.apply(newThis, otherArgs.concat(newArgs));
        };
      };

      function test(a, b, c) {
        return this.x + this.y + a + b + c;
      }

      const newTestfn = test.myOwnBind(
        {
          x: 1,
          y: 2,
        },
        3,
        4
      );

      console.log(newTestfn(5));
    },
  },
  {
    categoryId: CodeTypesEnum.PATTERNS,
    title: "Creating a call spy",
    description:
      "Create a mechanism that spies of function and store its calls",
    code: () => {
      // This is the function we want to spy on
      function work(a, b) {
        console.log(a + b);
      }

      // The spy function gets this function and return a new function with a
      // STATIC calls property on it!
      function spy(fn) {
        function wrapper(...args) {
          wrapper.calls.push([...args]); // Push the calls
          return fn.apply(this, args); // Call the original function
        }
        wrapper.calls = []; // STATIC property to save calls

        return wrapper;
      }

      spiedWork = spy(work);

      spiedWork(1, 2); // 3
      spiedWork(4, 5); // 9

      for (let args of spiedWork.calls) {
        console.log("call:" + args.join()); // "call:1,2", "call:4,5"
      }
    },
  },
  {
    categoryId: CodeTypesEnum.BLACK_BELT,
    title: "Finout Fetcher Question",
    description: `We have a function that takes an array IDs and fetch them from the remote by
    async opertation, we want to cache this function so known IDs results are taken from the cache`,
    code: async () => {
      const getDataCallSpy = {};
      const cache = {};

      const getData = (id) => {
        const m = Math.random() * 3000;
        getDataCallSpy[id] = (getDataCallSpy[id] ?? 0) + 1;
        return new Promise((resolve) => setTimeout(resolve(m), m));
      };

      const fetcher = (ids) => {
        const results = [];

        for (const id of ids) {
          if (!(id in cache)) {
            console.log(`${id} not in cache`);
            cache[id] = getData(id);
          } else {
            console.log(`${id} in cache`);
          }

          results.push(cache[id]);
        }
        return results;
      };

      const r1 = await Promise.all(fetcher([1, 2, 3]));
      const r2 = await Promise.all(fetcher([1, 3, 4, 5]));

      console.log(`Result 1: ${r1}`);
      console.log(`Result 2: ${r2}`);
      console.log(`Cache: ${JSON.stringify(cache)}`);
      console.log(`Call Spy: ${JSON.stringify(getDataCallSpy)}`);
    },
  },
  {
    categoryId: "Snippet",
    title: "Create curreid function from function",
    description:
      "We take a function as an argument and make that function curried",
    code: () => {
      function toCurried(func) {
        // The number of args needed to execute args
        const fullArgCount = func.length;

        // We define a function we can call within the returned function
        function createSubFunction(curriedArgs) {

          // The idea is to collect args until we get the number of args
          // that are needed to execute "func"
          return function(...args) {
            const newCurriedArguments = curriedArgs.concat(args);
            
            if (newCurriedArguments.length > fullArgCount) {
              throw new Error("Too many arguments");
            }

            if (newCurriedArguments.length === fullArgCount) {
              return func(...newCurriedArguments);
            }

            // If not enough args, create a new function passing the arguments until now
            return createSubFunction(newCurriedArguments);     
          };
        }

        // We first call create sub function without args array
        return createSubFunction([]);
      }

      function add(x, y) {
        console.log(x + y);
      }

      const result = toCurried(add)(1)(2);
      console.log(result);
    },
  },
];
