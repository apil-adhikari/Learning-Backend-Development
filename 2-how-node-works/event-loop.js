//  Simulating EVENT LOOP
// Expremly difficult to simulate because we can't really put many callbacks in all the callback queues
// When is it easy to simulate event loop? -> When there are many callbacks

const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1;

// Setting a timeout function to expire after 0 second.
setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("./test-file.txt", "utf-8", (err, data) => {
  console.log("I/O finished...");
  console.log("-------------------------");

  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  // These are called as soon as any one step of the loop has finished (which was running before.)
  // for example: "I/O finished" will run and since process.netxTick() runs as soon as the running sep is finished.
  process.nextTick(() => console.log("Process.nextTick"));

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "1 Password Encrypted...");
  });

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "2 Password Encrypted...");
  });

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "3 Password Encrypted...");
  });

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "4 Password Encrypted...");

    // These below codes are not in event loop (they are synchronous codes)
    crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
    console.log("5 Synchronously Password Encrypted");
    crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
    console.log("5 Synchronously Password Encrypted");
    crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
    console.log("5 Synchronously Password Encrypted");
    crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
    console.log("5 Synchronously Password Encrypted");

    // End of synchronouse code which are not in event loop.
  });
});

// Top level code(it is not inside any callback function)
console.log("Hello from the top level code!");
