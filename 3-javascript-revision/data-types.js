
/** 
 * 1. Number
 * 2. Null
 * 3. Undefined
 * 4. Boolean
 * 5. Object and JSON
 * 6. String
 * 7. Array
 * 8. Symbol
 * 9. NaN
 * 
 * PRIMITIVE DATA TYPES :String, number, boolean, null, symbol
 *  
 * // Derrived Data Types: Undefined, Array, Object, JSON
 * 
 */


let a = ""
let b = ''
let c = ``
let d = "10";

// NUMBER
let e = 123;
let f = 1.34343;
let g = 15e10 ^ 10;


// 
let h = d - e;
console.log(h)

// Boolean
let i = true; // or false

//null
let j = null; // Empty data
// ✅ j.push()
j === null // returns true
j === "" // returns false

// String nulls: "", '', ``
let k = ""
// ❌ k.push()
k === "" // returns false

// SYMBOL: Help to set unique keys
// let symb = new Symbol();
// let symb1 = new Symbol();

// symb === symb1 // returns false

let user = {
    key: "value",
    key: "value1" // This will override the previous key value
}
// always give the unique key

// --------------DERRIVED DATA TYPE------------------------------------
let data; //UNDEFINED: declaring the varialb without the value
console.log(data) // data does not have any value and no data type as no value is assigne to the variable
console.log("-----------")

console.log(typeof e) // number

let str = "";
console.log(typeof str) // string 

let boolTrue = true;
console.log(typeof boolTrue) //boolean

//Null: Data type-> Object
let nullData = null;
console.log(typeof nullData) // null ?? ✅object

// Array: Data type-> Object
let arr = []
console.log(typeof arr); // arr ?? ✅object

// Object 
let newObject = {
    name: "Apil Adhikari",
    age: 21
}
console.log(typeof newObject)

// JSON Data
const testJsonData = {
    "name": "Apil Adhikari",
    "age": 21
}
console.log(typeof testJsonData);

let myName = "APIL"; // This might be string but we can use . operator to the object data types. So, at base JS uses only one data type -> Object data type
myName.toLowerCase()

let floatNum = 123.4567890;
floatNum.toFixed(2);

// ARRAY --------------------------------------
// Array is a collection of data, seprated by comma, stored in index value pair, index is assigned by default, starting from 0.
// Can containt all data types

let arrayData = [
    "element", "element"
];

// Can be assigned as an object of an Array() class
let allUsers = new Array(
    "value", 123, true
)



let students = [];

let student_1 [
    "StudentName",  // 0
    "Class",         //1
    "Rollno",       //2
    ["email1", "email2"],         //3
    "address"        //4
]

// size = no of elements  5
// lastindex = size -1

console.log(student_1[0]);

// Single Dimensional & Multidimensional Array
console.log(student_1[3][0]);

// Object----------------------
// Also the collection of data to represent the physical state
// We can object an information while we call array an raw data.

let std_1 = {
    name: "Student Name",
    class: 1,
    rollNo: 123,
    email: ["email1", "emai2"], // Object -> we can arrays inside the object, object -> object, array-> object
    address: "Kathmandu"
}

let std_2 = {
    class: 1,
    email: ["email1", "emai2"], // Object -> we can arrays inside the object, object -> object, array-> object
    rollNo: 123,
    address: "Kathmandu",
    name: "Student Name"
}

console.log(std_1.name)
console.log(std_1['name']);

console.log(std_2.name)
console.log(std_2['name']);

//NaN