/**
 * a. Arithmetic Operator
 *      +,-,*,/, %
 * b. Increment and Decrement Operator
 * ++, --
 * 
 * c. Assignment Operator
 *  =, +=, -=,*=, /=, %=
 * 
 * d. String or Concatination Operator
 *      +, ,
 * 
 * e. Comparison Operator
 *      <,>,<=, >=, ==, !=, ===, !==
 * 
 * f. Logical Operator
 *      &&, ||, !
 * 
 * g. Conditional Or Ternary Operator
 *      (single line if-else statement)
 * 
 * h. Null Coleaching Operator: Either setting default value or returning some value
 *      value ?? default-value
 * 
 * i. Spread or Rest Operator
 *      ...
 * 
 * j. Bitwise Comparison Operator
 */

let a = 10;
let b = 3;
let c = a / b; // 3.333
let d = a % b; // 1

// 10 => 10;
a++ // a = a + 1 => 10 +1 => 11
console.log(a) //a = 11
//a = 11
++a // pre increment => 11 + 1 => a = 12
console.log(a) // a = 12

// This doesnot matter so much as our value are being incremented serially
console.log("----------------------------------");
// Lets look at another example:
let x = 10;
console.log(x);
console.log(`Value of x : ${x}`);
// Post Increment => first do the job of printing and then increment the value
console.log(x++);
console.log(`Value of x : ${x}`);

// Pre Increment => first increment the value and then do the job of printing
console.log("Pre Increment");
console.log(++x);
console.log(`Value of x : ${x}`);

let y = 20;
// console.log(y++);
console.log(++y);


a = 10;
a++;
++a;
a += 1;
a = a + 1;


console.log("Value" + a)
// alert("Hello",)

let name = "Apil"
let lastname = "Adhikari"

// name = name + "" + lastname
name += lastname; // helps to concatinate and then assign the value after concatination.
console.log(name) // Apil Adhikari

let p = 10;
let q = "10"

// EXPRESSION
// if(x) 
console.log(p == q) // == checks the value so true.
console.log(p === q) // === checks the value as well as data type so we get false.

console.log(p > 10);
console.log(q > 10)

console.log((p === y) && (p >= y))

let product = {
    name: "Product 1",
    price: 1000,
    discount: 10
}

// (product.discount || product.discount > 0)

// !Array.includes()

// CONDITIONAL or TERNARY Operator: One line statement

// (exp) ? (true condition) : (false condition)
// let discount = (product.discount && product.discount > 0) ? product.discount : 0;

let user = { gender: "Male", age: 21 }

let gender = user.gender ? user.gender : null;
let age = user.age ? user.age : null;

gender = user.gender ?? null;
age = user.age ?? null;


let student = {
    name: "Apil Adhikari",
    marksObtained: 99,
    percentage: '99%'
}

// marks, percentage

let marks = (student.marksObtained ? student.marksObtained : 0)
let percentage = student.percentage ?? null;

console.log(marks);
console.log(percentage)

// newUser = user; -> REferences, so same thing
// newUser.age = 20; -> this changes the original object's value
// using spread operator, it doesnot reference the original variable

let newUser = {
    // gender: "Male", age: 21, name: "Student 1"
    ...user,
    name: "Student One",
    age: 20
}

console.log(user.age)// 21

console.log(newUser.age) // Overrides the old variable but doesnot references to the older variable -> 20 
console.log(newUser)


let allowed = ['jpg', 'jpeg', 'png']
let pdfType = ['doc', 'docx', 'pdf']

let merged = [
    ...allowed, ...pdfType
]

// REST Operator : Mainly on object data type

let std1 = {
    name: "Student One",
    address: "Kathmandu",
    email: "std@one.com",
    class: "Bachelors",
    rollno: 1
}

// let fullname = std1.name;
// let address = std1.address;
// let email = std1.email,
//     let others = {
//         class: std1.class,
//         rollno: std1.rollno
//     }

// Object Destructure

let { name: fullname, address, email, ...other } = std1;

console.log(fullname, address, email, other.class, other.rollno);

//#region : React Example 
// REACT EXAMPLE Rest Operator Usage using DESTRUCTURING
{/* <Component name="" email="" address:"" />



    Component({ name, email, ...other }) {
    //name
    //address
    //other.address


} */}
// props
// => {name:"",email:"",address:""}

//END OF REACT EXAMPLE
//#endregion: End of React example

