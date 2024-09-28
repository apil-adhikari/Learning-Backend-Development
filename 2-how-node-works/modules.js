// console.log(arguments);
// console.log(require("module").wrapper);

// module.exports
const C = require("./text-module-1");
const calculator1 = new C();
console.log(calculator1.add(2, 5));

// exports
// const Calc2 = require("./modules2");
// console.log(Calc2.multiply(2, 5));

// Using Destructuring
const { add, multiply, divide } = require("./modules2");
console.log(multiply(2, 5));

// caching
// requiring without storing the exported object and call the function as soon as we require.

require("./module3")();
require("./module3")();
require("./module3")();
// Although, we are requiring the module3 three times, the conetent it has will be cached at first and after that it will be called from that cache but displayed only once.
// but in the case of function, since each functions are called in each require immediately, the function will be called 3 times but also from the cache.
