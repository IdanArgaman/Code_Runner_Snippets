/* eslint-disable */

const CodeTypesEnum = {
    ARRAYS: "Arrays",
    TRICKS: "Tricks",
    PATTERNS: "PATTERNS"
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
        "title": "Meomize at the prototype level",
        "description": "",
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
]