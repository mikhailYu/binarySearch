const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function mergeSort(inputArr) {
  if (inputArr.length < 2) {
    return inputArr;
  }
  let result = [];
  let arrHalf = Math.round(inputArr.length / 2);
  let leftArr = inputArr.splice(0, arrHalf);
  let rightArr = inputArr;
  return merge(mergeSort(leftArr), mergeSort(rightArr));

  function merge(left, right) {
    while (left.length > 0 && right.length > 0) {
      if (left[0] <= right[0]) {
        result.push(left.shift());
      } else {
        result.push(right.shift());
      }
    }

    while (left.length) {
      result.push(left.shift());
    }

    while (right.length) {
      result.push(right.shift());
    }

    return result;
  }
}

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor() {
    this.root = null;
    this.start = null;
    this.end = null;
  }

  buildTree(inputArr) {
    let sortedArr = mergeSort(inputArr);

    this.root = nodeToBst(sortedArr, 0, sortedArr.length - 1);

    function nodeToBst(array, start, end) {
      if (start > end) {
        return null;
      }

      let mid = parseInt((start + end) / 2);

      let node = new Node(array[mid]);

      node.left = nodeToBst(array, start, mid - 1);
      node.right = nodeToBst(array, mid + 1, end);

      return node;
    }
  }

  insert(key) {
    this.root = insertRec(this.root, key);

    function insertRec(root, key) {
      if (root == null) {
        root = new Node(key);
        return root;
      }

      if (key < root.data) {
        root.left = insertRec(root.left, key);
      } else if (key > root.data) {
        root.right = insertRec(root.right, key);
      }

      return root;
    }
  }

  delete(key) {
    this.root = deleteRec(this.root, key);

    function deleteRec(root, key) {
      if (root == null) {
        return root;
      }
      if (key < root.data) {
        root.left = deleteRec(root.left, key);
      } else if (key > root.data) {
        root.right = deleteRec(root.right, key);
      } else {
        if (root.left == null) {
          return root.right;
        } else if (root.right == null) {
          return root.left;
        }

        root.data = minValue(root.right);

        root.right = deleteRec(root.right, root.data);
      }
      return root;
    }

    function minValue(root) {
      let minV = root.data;

      while (root.left != null) {
        minV = root.left.data;
        root = root.left;
      }
      return minV;
    }
  }

  find(value) {
    if (findRec(this.root, value)) {
      return value + " exists";
    } else {
      return value + " does not exist";
    }

    function findRec(node, value) {
      if (node == null) {
        return false;
      }

      if (node.data == value) {
        return true;
      }

      let finder1 = findRec(node.left, value);

      if (finder1) {
        return true;
      } else {
        let finder2 = findRec(node.right, value);
        return finder2;
      }
    }
  }

  levelOrder() {
    if (this.root == null) {
      return;
    }

    let queue = [];
    let current;
    let str = "";
    queue.push(this.root);

    while (queue.length != 0) {
      current = queue[0];
      if (current.left != null) {
        queue.push(current.left);
      }
      if (current.right != null) {
        queue.push(current.right);
      }
      str += " -> " + current.data;
      queue.shift();
    }
    return "level order:" + str;
  }

  preorder() {
    let current = this.root;
    let str = "";
    preorderRec(current);
    return "pre Order: " + str;
    function preorderRec(node) {
      if (node == null) {
        return;
      }
      str += " -> " + node.data;

      preorderRec(node.left);
      preorderRec(node.right);
    }
  }

  inorder() {
    let current = this.root;
    let str = "";
    inorderRec(current);
    return "in Order: " + str;
    function inorderRec(node) {
      if (node == null) {
        return;
      }

      inorderRec(node.left);

      str += " -> " + node.data;
      inorderRec(node.right);
    }
  }

  postorder() {
    let current = this.root;
    let str = "";
    postorderRec(current);
    return "post Order: " + str;
    function postorderRec(node) {
      if (node == null) {
        return;
      }

      postorderRec(node.left);
      postorderRec(node.right);

      str += " -> " + node.data;
    }
  }

  height(val) {
    let height = -1;

    heightRec(this.root, val);

    function heightRec(root, val) {
      if (root == null) {
        return -1;
      }

      let lHeight = heightRec(root.left, val);
      let rHeight = heightRec(root.right, val);

      let result = Math.max(lHeight, rHeight) + 1;

      if (root.data == val) {
        height = result;
      }
      return result;
    }
    console.log("Height of " + val + " is " + height);
  }

  depth(val) {
    console.log("The depth of " + val + " is " + depthRec(this.root, val));
    function depthRec(root, val) {
      if (root == null) {
        return -1;
      }

      let dist = -1;

      if (
        root.data == val ||
        (dist = depthRec(root.left, val)) >= 0 ||
        (dist = depthRec(root.right, val)) >= 0
      ) {
        return dist + 1;
      }
      return dist;
    }
  }

  isBalanced() {
    return balancedRec(this.root);

    function getHeight(root) {
      if (root == null) {
        return 0;
      }

      return Math.max(getHeight(root.left), getHeight(root.right)) + 1;
    }

    function balancedRec(root) {
      if (root == null) {
        return true;
      }

      let lH = getHeight(root.left);
      let rH = getHeight(root.right);

      if (
        Math.abs(lH - rH) <= 1 &&
        balancedRec(root.left) == true &&
        balancedRec(root.right) == true
      ) {
        return true;
      }

      return false;
    }
  }

  rebalance() {
    let resortedArr = [];

    storeNodes(this.root);

    function storeNodes(root) {
      if (root == null) {
        return;
      }

      storeNodes(root.left);
      resortedArr.push(root.data);
      storeNodes(root.right);
    }

    this.buildTree(resortedArr);
  }
}

let tree = new Tree();

// Create a binary search tree from an array of random numbers.
tree.buildTree([
  3, 12, 1, 9, 8, 14, 11, 16, 6, 28, 4, 2, 87, 32, 81, 18, 49, 27, 67, 72, 30,
]);

//Confirm that the tree is balanced by calling isBalanced
console.log("is the tree balanced? : " + tree.isBalanced());

//Print out all elements in level, pre, post, and in order
console.log(tree.preorder());
console.log(tree.inorder());
console.log(tree.postorder());

//Unbalance the tree by adding several numbers > 100
tree.insert(30);
tree.insert(90);
tree.insert(36);
tree.insert(41);
tree.insert(31);
tree.insert(59);
tree.insert(99);
tree.insert(98);
tree.insert(27);
tree.insert(74);

//Confirm that the tree is unbalanced by calling isBalanced
console.log("is the tree balanced? : " + tree.isBalanced());

//Balance the tree by calling rebalance
tree.rebalance();

//Confirm that the tree is balanced by calling isBalanced
console.log("is the tree balanced? : " + tree.isBalanced());

//Print out all elements in level, pre, post, and in order
console.log(tree.preorder());
console.log(tree.inorder());
console.log(tree.postorder());

prettyPrint(tree.root);
