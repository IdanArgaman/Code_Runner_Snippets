/* eslint-disable */

const CodeTypesEnum = {
    ARRAYS: "Arrays",
    TRICKS: "Tricks",
    PATTERNS: "PATTERNS",
    ES6: 'ES6'
}

export default [{
        "categoryId": CodeTypesEnum.PATTERNS,
        "title": "Modern Memoize",
        "description": "",
        "code": () => {
            function memoize(f) {
                var memo = {};
                return function (...args) {
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
        }
    },
    {
        "categoryId": CodeTypesEnum.PATTERNS,
        "title": "Meomize at the prototype level",
        "description": "",
        "code": () => {
            Function.prototype.mkMemoize = function () {
                var memo = {};

                // this in the function we called memoize on!
                var fn = this;
                return function (...args) {
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
            }

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
                y: 2
            }

            simpleCalcMemoize.bind(person)(7, 8, 9);
        }
    },
    {
        "categoryId": CodeTypesEnum.PATTERNS,
        "title": "Private members simulation",
        "description": "Simluate private instance members by a single shared WeakMap resource",
        "code": () => {
            var Thing;

            {
                // We should note that the private WeakMap is ❗❗❗ SHARED ❗❗❗ between instances of Thing. 
                let privateScope = new WeakMap(); // can't be accessed outside the block, because we are using the ❗❗❗'let'❗❗❗ keyword!
                let counter = 0;

                Thing = function () {
                    this.someProperty = 'foo';

                    // Accessing the shared WeakMap, the key is "this" which is the currently created
                    // object instance. This "this" value is unique so it serves us as a unique place
                    // in the shared WeakMap resource
                    privateScope.set(this, {
                        hidden: ++counter,
                    });
                };

                Thing.prototype.showPublic = function () {
                    return this.someProperty;
                };

                Thing.prototype.showPrivate = function () {
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

        }
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
                        throw new Error('Note cannot be directly constructed.')
                    }
                }
            }

            class ColorNote extends Note {

            }

            try {
                let note = new Note(); // error!
            } catch (e) {
                console.log(e)
            }

            let colorNote = new ColorNote(); // ok
        }
    },
    {
        categoryId: CodeTypesEnum.PATTERNS,
        title: "Timed out promise",
        description: "Simulating a timed out promise using Promise.race",
        code: () => {
            // Wrap "setTimeout" in a promise such that if
            // the timeout completes, the promise is rejected

            const timeout = (delay = 30000) => {
                return new Promise((resolve, reject) => {
                    let rejectWithError = () => {
                        reject(new Error('Timed out!'));
                    };

                    setTimeout(rejectWithError, delay);
                });
            }

            // Return a promise that will be fulfilled if
            // the fetch is fulfilled before the timeout
            // is rejected.

            const fetchWithTimeout = (url, delay = 3000) => {
                // construct an array to pass to `Promise.race`
                // !!!!!!!!!!!!!NOTE!!!!!!!!!!!!
                return Promise.race([
                    fetch(url),
                    timeout(delay)
                ]);
            }

            // Make an XHR request for the URL that has to
            // return a response *before* the 1 s timeout
            // happens

            fetchWithTimeout('/json/data.json', 1000)
                .then(response => {
                    // successful response before the 1 s timeout
                    console.log('successful response', response)
                })
                .catch((e) => {
                    // Either the timeout occurred or some other error.
                    // Would need to check the method or use a custom
                    // `Error` subclass in `timeout`
                    console.error('request error', e);
                });

        }
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
        }
    },
    {
        categoryId: CodeTypesEnum.TRICKS,
        title: "Enforcing maximum number of params",
        description: "Using the spread operator to detect extra parameters",
        code: () => {
            function max(a, b, c, ...shouldBeEmpty) {
                if (shouldBeEmpty.length > 0)
                    throw Error('max 3 parameters allowed!');

                return Math.max(a, b, c);
            };

            // not an error
            // output 6
            max(4, 5, 6);

            // error!
            max(4, 5, 6, 7);
        }
    },
    {
        categoryId: CodeTypesEnum.TRICKS,
        title: "Enforcing required parameters",
        description: "Enforcing paramters with default value trick",
        code: () => {
            const required = () => {
                throw new Error('Missing parameter')
            };

            // The below function will throw an error if either "a" or "b" is missing.
            // We should note that the function gets executed when the parameter is missing
            // so the default value (the function) in this situtation executes.
            const add = (a = required(), b = required()) => a + b;

            add(1, 2) // 3

            add(1) // Error: Missing parameter.
        }
    },
    {
        categoryId: CodeTypesEnum.TRICKS,
        title: "Using reduce as filter and map",
        description: "",
        code: () => {
            const numbers = [10, 20, 30, 40];
            const doubledOver50 = numbers.reduce((finalList /* accamulator */ , num) => {

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
        }
    },
    {
        categoryId: CodeTypesEnum.TRICKS,
        title: "Using reduce to create a count map",
        description: "",
        code: () => {
            var cars = ['BMW', 'Benz', 'Benz', 'Tesla', 'BMW', 'Toyota'];
            var carsObj = cars.reduce(function (obj, name) {
                obj[name] = obj[name] ? ++obj[name] : 1;
                return obj;
                // Note that we initialize the accumulator to be an empty object
            }, {});

            console.log(carsObj); // => { BMW: 2, Benz: 2, Tesla: 1, Toyota: 1 }
        }
    },
    {
        categoryId: CodeTypesEnum.TRICKS,
        title: "Removing unwanted properties from an object",
        description: "",
        code: () => {
            let {
                _internal,
                tooBig,
                ...cleanObject
            } = {
                el1: '1',
                _internal: "secret",
                tooBig: {},
                el2: '2',
                el3: '3'
            };

            console.log(cleanObject); // {el1: '1', el2: '2', el3: '3'}
        }
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
                }
            })();

            (() => {
                /////////////////////////////////////////////
                /* Using array.entries to simulate forEach */
                /////////////////////////////////////////////

                const arr = ['a', 'b', 'c'];
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
                console.log(param1) // 2
                console.log(param2) // 1

            })();

            (() => {
                /////////////////////////////////////////////////
                /* Remove dups from array with the help of Set */
                /////////////////////////////////////////////////

                let MyArray = [1, 1, 2, 2, 3, 3];
                let deduped = [...new Set(MyArray)] // [1, 2, 3] -> Set's constructor accepts an array
                console.log(deduped);

            })();

            (() => {
                ////////////////////////////
                /* Dynamic Property Names */
                ////////////////////////////

                let city = 'sheffield_';

                let a = {
                    [city + 'population']: 350000
                };

                a[city + 'county'] = 'South Yorkshire';

                console.log(a);

            })();

            (() => {
                ////////////////////////
                /* Nested Destructing */
                ////////////////////////

                const user = {
                    id: 339,
                    name: 'Fred',
                    age: 42,
                    education: {
                        degree: 'Masters'
                    }
                };

                const {
                    education: {
                        degree // Note!
                    }
                } = user;

                console.log(degree); // Masters
            })();

            (() => {
                //////////////////////////////////////////
                /* Log variable with its name and value */
                //////////////////////////////////////////

                let myVar = 'foo';

                // output:
                // {myVar: "foo"}
                console.log({
                    myVar
                });
            })();

        }
    },
    {
        categoryId: CodeTypesEnum.PATTERNS,
        title: "Mixin pattern with classes",
        description: "Create a mixin functionality with classes and extend",
        code: () => {
            // This is a function that returns class that extend the supplied class by adding a save method
            // Note that we return a class with no name, we can assig to variable or to other "extends" keyword
            const Storage = Sup => /* 👍 anonymous class */ class extends Sup {
                save(database) {}
            };

            // This is a function that returns class that extend the supplied class by 
            // adding a validate method
            const Validation = Sup => class extends Sup {
                validate(schema) {}
            };

            class Person {}

            // Applying mixins on Person        
            class Employee extends Storage(Validation(Person)) {}
        }
    }
]
