/* eslint-disable */

const CodeTypesEnum = {
  ALGORITHM: "ALGORITHM"
}

export default [{
  "categoryId": CodeTypesEnum.ALGORITHM,
  "title": "Array pairs that sum to a given K",
  "description": `Given an array, print the pairs that their sum gives a result equals to k.
    We can find different implementation here: https://www.geeksforgeeks.org/count-pairs-with-given-sum/`,
  "code": () => {
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
      Object.keys(map).forEach(key => {
        // For a given key in the map, does the map contains a target key that complement it to k?
        if (map[k - key] !== undefined) {
          // if so iterate to indexes for the given key
          map[key].forEach(lidx => {
            // and iterate the indexes for the target key
            map[k - key].forEach(ridx => {
              // if the target key is different from the given key
              // this is important to avoid result for item being added to itself
              if (ridx !== lidx) {
                // push the key pairs to the result, using map avoids dup counting
                const a = Math.min(sampleArray[lidx], sampleArray[ridx]);
                const b = Math.max(sampleArray[lidx], sampleArray[ridx]);
                pairs[[a, b]] = pairs[[a, b]] ? pairs[[a, b]] + 1 : 1;
              }
            })
          })
        }
      });

      Object.keys(pairs).forEach(keyPair => console.log(keyPair + `: ${pairs[keyPair] / 2}`));
    }

    findPairs(sampleArray, k);

  }
}, {
  categoryId: CodeTypesEnum.ALGORITHM,
  title: "Maximum sub array problem",
  description: "Printing the maximum sub array sum and its start and end indexes",
  code: () => {
    const sampleArray = [-1, 5, -1, -5, 3, -3, 4, 2, 2, -8, 9, 1, 4, -3];

    function maximumSubArray(arr) {
      if (!arr.length) return;

      let max = arr[0];
      let startIdx = 0;
      let endIdx = 0

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
        endIdx
      };
    }
    const result = maximumSubArray(sampleArray);
    console.log(`max is ${result.max}, and it is found between ${result.startIdx} to ${result.endIdx} indexes`);

  }
}, {
  categoryId: CodeTypesEnum.ALGORITHM,
  title: "Smart stack - a stack that tracks the minimum item within it and allow getting it O(1)",
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
        if (this.stackMinArr.length == 0 || num <= this._last(this.stackMinArr)) {
          this.stackMinArr.push(num);
        }
      },

      pop() {
        const num = this.stackArr.pop();
        if (num === this._last(this.stackMinArr)) {
          this.stackMinArr.pop();
        }
      },

      getMin() {
        return this._last(this.stackMinArr);
      }
    }

    Stack.push(5);
    Stack.push(2);
    Stack.push(3);
    Stack.push(1);
    Stack.push(4);
    Stack.push(-1);
    Stack.push(0);

    console.log(`Stack minimum: ${Stack.getMin()}`);

    Stack.pop();

    console.log(`Stack minimum: ${Stack.getMin()}`);

    Stack.pop();

    console.log(`Stack minimum: ${Stack.getMin()}`);

    Stack.pop();
    Stack.pop();
    Stack.pop();

    console.log(`Stack minimum: ${Stack.getMin()}`);
  }
}]

/*
missing number 1...N - two versions: one that handles large number of items
array sum until index + change item
https://www.log2base2.com/data-structures/array/remove-a-specific-element-from-array.html

------------------------------------------------------------------

Minimum heap from React scheduler code:
taken from (https://programmer.group/exploring-the-inner-of-react-postmessage-scheduler.html)
Note the code is written in flow, so we must convert it to JS:


type Heap = Array<Node>;
type Node = {|
  id: number,
  sortIndex: number,
|};

//////////////////////
// Pushing the heap //
//////////////////////

export function push(heap: Heap, node: Node): void {
  const index = heap.length;	// index will become the index of the element we push next line
  heap.push(node);				// Push
  siftUp(heap, node, index);	// Then sort, note we provide the index of the element we've just pushed
}

function siftUp(heap, node, i) {
  let index = i;
  while (true) {
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (parent !== undefined && compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

/////////////////////
// Poping the heap //
/////////////////////

export function pop(heap: Heap): Node | null {
  const first = heap[0];
  if (first !== undefined) {
    const last = heap.pop();
    if (last !== first) {
      heap[0] = last;
      siftDown(heap, last, 0);
    }
    return first;
  } else {
    return null;
  }
}

function siftDown(heap, node, i) {
  let index = i;
  const length = heap.length;
  while (index < length) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // If the left or right node is smaller, swap with the smaller of those.
    if (left !== undefined && compare(left, node) < 0) {
      if (right !== undefined && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (right !== undefined && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}
------------------------------------------------------------------
*/