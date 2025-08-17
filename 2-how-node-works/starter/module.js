const Calculator1 = require("./test-module-1");
const calc1 = new Calculator1();
console.log(calc1.add(5, 2));

const { add, divide, multiply, subtract } = require("./test-module-2");
console.log(multiply(5, 2));

require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
