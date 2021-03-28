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
    }
]