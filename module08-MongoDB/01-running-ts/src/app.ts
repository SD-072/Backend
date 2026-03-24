// import something from "../.../../utils/helper.js"
// import something from "@utils"
// import something from "@components"
// # Relative imports
// import { pickRandom } from './utils/index';
// import { UserModel } from './models/user.ts';

// # Aliases - often come with barrel files (index.ts)
import { pickRandom } from '#utils';

// # Barrel files - usally an index.ts, that re-exports things from one folder
// /src/models/index.ts

// const message = 'Hello from TypeScript!';
// console.log(message);

// function add(a: number, b: number) {
//   return a + b;
// }

// console.log(add(5, 5));

// console.log(process.env.MESSAGE);

console.log(pickRandom([1, 2, 3, 4, 5]));
console.log(pickRandom(['apple', 'banana', 'cherry']));
console.log(pickRandom([]));
console.log(pickRandom([true, false, true]));
console.log(pickRandom(['red', 'green', 'blue', 'yellow']));
console.log(pickRandom([null, undefined, 42]));
console.log(pickRandom(['a', 'b', 'c', 'd', 'e', 'f', 'g']));
console.log(pickRandom([1.1, 2.2, 3.3, 4.4, 5.5]));
console.log(pickRandom(['x', 'y', 'z', 'w', 'v']));
