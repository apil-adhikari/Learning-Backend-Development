// let, var and const
// 1) Naming conventions


let fullName = "Apil Adhikari";
console.log(fullName)

fullName = "Ram";
console.log(fullName)

// Scope: global, block, functional

var email = "test@test.com"
// No redeclaration but we can change the value
// let fullName = "HLOOO" // ERROR
fullName = "Ram"

var email = "test@email.com"
var email = "updated@email.com"

console.log("var scope")
var x = 10; // MEMORY INDEX ===>12345
console.log(x) // 10 

{
    var x = 20; // points to same memory address ===>12345 ->20
    console.log(x); // 20
}

console.log(x) // 20 ==>> still the block has changed, but the scope of variable hasn't changed. ===>12345 -> 20

console.log("-----------------------------")

console.log("let scope")
let y = 10; // INITILIZE: MEMORY INDEX===> 12345, VALUE -> 10
console.log(y) // 10

{
    // y = 20; // When inside the block(either we reinitilize or declare), it takes new MEMORY INDEX ===>23456, new VALUE -> 20, THIS VALUE ONLY MAINTAINED INSIDE THE SCOPE, WHEN THE VARIALBE IS USED OUTSIDE THE SCOPE
    console.log(y); // 20
} // As soon as this block ends, the memory address holding the value of y is destroyed.

console.log(y) // 10 MEMORY ADDRESS===>23456, retains OLD value

// Constants : Whose vales are fixed.   
// We cant only decalre constant, value must be assigned.
const PI = 3.14;
const GRAVITY = 9.8;
GRAVITY = 10;
// cant be redeclared

// Const data types can be change if they are derrived data types: array, object, json, etc

const user = {

}

user.name = "Apil Adhikari"
