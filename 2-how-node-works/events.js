// EVENTS in practice:
// To use built in node events, we need to require the events moduel -> from that we are going to require eventEmitter class

const EventEmitter = require("events");
const http = require("http");

// To create an emitter, we create an instance of the class
// const myEmitter = new EventEmitter();

// Real life sceneario:
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

// EventEmitter emit the named events to which we can subscribe(ie. we can listen to them).

// =========START OF OBSERVER PATTERN=================
// Setting up the listners:
// OBSERVER (EventEmitters. )
myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

// we can react to same event by setting multiple listner.
myEmitter.on("newSale", () => {
  console.log(`Customer name: Apil`);
});

// Using the arguments sent by emitter here in event listner.
myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});
//OBSERVER
// -------------------------------

// We want to emit an event called newSales:
// We can also pass arguments to event listners by passing them as additional arguments to the emitters and receive them in the listners
myEmitter.emit("newSale", 9);

// =========END OF OBSERVER PATTERN=================

//////////////////////////////////////////////
const server = http.createServer();

server.on("request", (req, res) => {
  console.log(req.url);
  console.log("LOG FROM 1ST LISTENER: Request reveived!!");

  res.end("Request Received!!!");
});

server.on("request", (req, res) => {
  console.log("LOG FROM 2ND LISTENER: Another request received!!!");
});

server.on("close", () => {
  console.log("Server closed!!!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for request");
});
