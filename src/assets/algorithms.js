/* eslint-disable */

const CodeTypesEnum = {
  ALGORITHM: "ALGORITHM",
};

export default [
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "JS indexOf implementation",
    description: "",
    code: () => {
      function indexOf(str, query) {
        for (let i = 0; i < str.length; i++) {
          for (let j = 0; j < query.length; j++) {
            if (str[i + j] !== query[j]) {
              break;
            }

            if (j === query.length - 1) {
              return i;
            }
          }
        }

        return -1;
      }

      console.log(indexOf("bbbbbc", "bbbc"));
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "Array pairs that sum to a given K",
    description: `Given an array, print the pairs that their sum gives a result equals to k.
    We can find different implementation here: https://www.geeksforgeeks.org/count-pairs-with-given-sum/`,
    code: () => {
      const sampleArray = [1, 5, 1, 5, 3, 3, 4, 2, 2];
      const k = 6;

      function findPairs(sampleArray, k) {
        // Map the array, store in the map the index each ke is found at
        const map = {};
        for (let i = 0; i < sampleArray.length; i++) {
          const j = sampleArray[i];
          if (map[j] !== undefined) {
            map[j].push(i);
          } else {
            map[j] = [i];
          }
        }

        // Use the map to find pairs
        const pairs = {};
        Object.keys(map).forEach((key) => {
          // For a given key in the map, does the map contains a target key that complement it to k?
          if (map[k - key] !== undefined) {
            // if so iterate to indexes for the given key
            map[key].forEach((lidx) => {
              // and iterate the indexes for the target key
              map[k - key].forEach((ridx) => {
                // if the target key is different from the given key
                // this is important to avoid result for item being added to itself
                if (ridx !== lidx) {
                  // push the key pairs to the result, using map avoids dup counting
                  const a = Math.min(sampleArray[lidx], sampleArray[ridx]);
                  const b = Math.max(sampleArray[lidx], sampleArray[ridx]);
                  pairs[[a, b]] = pairs[[a, b]] ? pairs[[a, b]] + 1 : 1;
                }
              });
            });
          }
        });

        Object.keys(pairs).forEach((keyPair) =>
          console.log(keyPair + `: ${pairs[keyPair] / 2}`)
        );
      }

      findPairs(sampleArray, k);
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "Maximum sub array problem",
    description:
      "Printing the maximum sub array sum and its start and end indexes",
    code: () => {
      const sampleArray = [-1, 5, -1, -5, 3, -3, 4, 2, 2, -8, 9, 1, 4, -3];

      function maximumSubArray(arr) {
        if (!arr.length) return;

        let max = arr[0];
        let startIdx = 0;
        let endIdx = 0;

        let maxSoFar = Math.max(max, 0);
        let tempStartIdx = maxSoFar > 0 ? 0 : null;

        for (let i = 1; i < arr.length; i++) {
          maxSoFar += arr[i];

          if (tempStartIdx === null) {
            tempStartIdx = i;
          }

          if (maxSoFar > max) {
            max = maxSoFar;
            endIdx = i;
            startIdx = tempStartIdx;
          }

          if (maxSoFar <= 0) {
            maxSoFar = 0;
            tempStartIdx = null;
          }
        }

        return {
          max,
          startIdx,
          endIdx,
        };
      }
      const result = maximumSubArray(sampleArray);
      console.log(
        `max is ${result.max}, and it is found between ${result.startIdx} to ${result.endIdx} indexes`
      );
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "Maximum sub array problem - clever!",
    description: "Printing the maximum sub clever solution",
    code: () => {
      const nums = [-1, 5, -1, -5, 3, -3, 4, 2, 2, -8, 9, 1, 4, -3];

      let maxSum = -Infinity;
      let currentSum = 0;

      // iterate through the nums, store sub-problems result
      for (let i = 0; i < nums.length; i++) {
        //cumulating answers to the top

        //compare currentSum add current number
        //with current number and store the maximum value
        currentSum = Math.max(nums[i], currentSum + nums[i]);

        //compare maxSum with currentSum and store the greater value
        maxSum = Math.max(currentSum, maxSum);
      }

      return maxSum;
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title:
      "Smart stack - a stack that tracks the minimum item within it and allow getting it O(1)",
    description: `In addition to support of push, pop methods as a regular stack, the stack provides getMin
    that returns the minimum item within it`,
    code: () => {
      const Stack = {
        stackArr: [],
        stackMinArr: [],

        _last(arr) {
          return arr.slice(-1)[0];
        },

        // Starting with ECMAScript 2015, a shorter syntax for method definitions
        // on objects initializers is introduced.
        push(num) {
          this.stackArr.push(num);
          if (
            this.stackMinArr.length == 0 ||
            num <= this._last(this.stackMinArr)
          ) {
            this.stackMinArr.push(num);
          }
        },

        pop() {
          const num = this.stackArr.pop();
          if (num === this._last(this.stackMinArr)) {
            this.stackMinArr.pop();
          }

          return num;
        },

        getMin() {
          return this._last(this.stackMinArr);
        },
      };

      Stack.push(5);
      Stack.push(2);
      Stack.push(3);
      Stack.push(1);
      Stack.push(4);
      Stack.push(-1);
      Stack.push(0);

      console.log(`Stack minimum: ${Stack.getMin()}`);
      console.log(`Pop : ${Stack.pop()}`);
      console.log(`Stack minimum: ${Stack.getMin()}`);
      console.log(`Pop : ${Stack.pop()}`);
      console.log(`Stack minimum: ${Stack.getMin()}`);
      console.log(`Pop : ${Stack.pop()}`);
      console.log(`Pop : ${Stack.pop()}`);
      console.log(`Pop : ${Stack.pop()}`);
      console.log(`Stack minimum: ${Stack.getMin()}`);
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "Missing number in array from 1 to N",
    description:
      "We get an array from 1 to N but with a missing number within, so we need to find it",
    code: () => {
      const arrWithMissingNumber = [1, 2, 3, 4, 5, 6, 8];

      function findMissing(arrWithMissingNumber) {
        // Naive method - may overflow for large array!
        let sum = 1;
        let arraySum = 0;

        for (let i = 0; i < arrWithMissingNumber.length; i++) {
          sum += i + 2;
          arraySum += arrWithMissingNumber[i];
        }

        console.log(`The missing number is: ${sum - arraySum}`);
      }

      function findMissingSmart(arrWithMissingNumber) {
        let arraySum = 0;
        let sum = 1;

        for (let i = 0; i < arrWithMissingNumber.length; i++) {
          sum += i + 2 - arrWithMissingNumber[i];
        }

        console.log(`The missing number is (SMART): ${sum - arraySum}`);
      }

      findMissing(arrWithMissingNumber);
      findMissingSmart(arrWithMissingNumber);
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "Sub array sum problem",
    description: `We need to easily find the sum of a sub array, the problem is that the array
    can be updated and we must do the update and retrieval efficiently.<br/>
    We can solve the problem in many ways:
    <ul>
      <li>
       The naive way that calculates the sub sum every time.
      </li>
      <li>
        A smarter way that stores suffers from updates, and a tree way
      </li>
      <li>
        Using Fenwick tree that allows an efficient retrieval and update - O(log(n))
      </li>
    </ul>
    `,
    code: () => {
      function updateBIT(tree, arrayLength, index, val) {
        // index in trr is 1 more than the index in arr
        index = index + 1;

        // Traverse all ancestors and add 'val'
        while (index <= arrayLength) {
          // Add 'val' to current node of BI Tree
          tree[index] += val;

          // Update index to that of parent in update View
          index += index & -index;
        }
      }

      // Returns sum of arr[0..index]. This function assumes
      // that the array is preprocessed and partial sums of
      // array elements are stored in BITree[].
      function getSum(tree, index) {
        let sum = 0; // Iniialize result

        // index in tree is 1 more than the index in arr
        index = index + 1;

        // Traverse ancestors of tree
        while (index > 0) {
          // Add current element of tree to sum
          sum += tree[index];

          // Move index to parent node in getSum View
          index -= index & -index;
        }
        return sum;
      }

      function constructBITree(arr) {
        // Create and initialize the tree
        const tree = new Array(arr.length + 1);
        for (let i = 1; i <= arr.length; i++) tree[i] = 0;

        // Store the actual values in tree using update()
        for (let i = 0; i < arr.length; i++)
          updateBIT(tree, arr.length, i, arr[i]);

        return tree;
      }

      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const tree = constructBITree(arr);

      console.log(tree);
      console.log("Sum [0..2]: " + getSum(tree, 2)); // 3 elements sum
      console.log("Sum [0..8]: " + getSum(tree, 8)); // 9 elements sum
      console.log("Sum [0..5]: " + getSum(tree, 5)); // 6 elements sum
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "Can Jump Problem",
    description: `
    You are given an integer array nums. You are initially positioned at the array's first index, 
    and each element in the array represents your maximum jump length at that position.
    Return true if you can reach the last index, or false otherwise.

    Solution:

    Imagine you have a car, and you have some distance to travel (the length of the array). This car has 
    some amount of gasoline, and as long as it has gasoline, it can keep traveling on this road (the array).
    Every time we move up one element in the array, we subtract one unit of gasoline. However, every time
    we find an amount of gasoline that is !!!GREATER!!! than our current amount, we "gas up" our car by
    replacing our current amount of gasoline with this new amount. We keep repeating this process until
    we either run out of gasoline (and return false), or we reach the end with just enough gasoline 
    (or more to spare), in which case we return true.

    Note: We can let our gas tank get to zero as long as we are able to gas up at that immediate location
    (element in the array) that our car is currently at.

    `,
    code: () => {
      function canJump(nums) {
        let gas = 0;

        for(n of nums) {
            if (gas < 0)
                return false;
            else if (n > gas) {
              gas = n
            }
            gas -= 1
        }
            
        return true;
      }

      console.log(canJump([2,3,1,1,4]));
      console.log(canJump([2,0,0,1,4]));
      console.log(canJump([1,0,5,1,4]));
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "Can Jump Problem - Reversed Solution",
    
    description: `We start from the end of the array. At each stage we determine how much steps
    are needed to get to the item after the current position. At the first iteration, there are no
    numbers after the current position, so the required steps are 0. If the current step is greater/equal
    than the required steps, we reset the requiredSteps to 1 and move next. If the current step is
    less than the required steps, we increase the requiredSteps and move next.
    If we arrive to the start of the array, and the current step is greater/equal the required steps
    we return true, otherwise a false is returned!`,

    code: () => {
      function canJump(nums) {
        let requiredSteps = 0;
        let length = nums.length - 1;

        for(let i = 0; i <= length; i++) {
           if(nums[length - i] >= requiredSteps) {
              requiredSteps = 0;
              if(i === length) {
                return true;
              }
           } 
           requiredSteps++;
        }
            
        return false;
      }

      console.log(canJump([2,3,1,1,4]));
      console.log(canJump([2,0,0,1,4]));
      console.log(canJump([2,0,2,0,1]));
    },
  },
  {
    categoryId: CodeTypesEnum.ALGORITHM,
    title: "Palindrom - One Liner",
    description: ``,
    code: () => {
      const str = 'abcdXdcba';
      let rev = str.split("").reverse().join("");
      console.log(rev === str);

      const str2 = 'abcdXXcba';
      let rev2 = str.split("").reverse().join("");
      console.log(rev2 === str2);
    },
  },
];

// Find sub array with a given sum: https://www.geeksforgeeks.org/find-subarray-with-given-sum/
// https://www.log2base2.com/data-structures/array/remove-a-specific-element-from-array.html
