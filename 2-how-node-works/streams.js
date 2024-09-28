const fs = require("fs");
const server = require("http").createServer();

// listening to event
server.on("request", (req, res) => {
  // SOLUTION 1: This works file, but the problem is that node will have to load entire file into the memory and only after the readig the whole data it can send back the response.
  // 1) Problem for big files,
  // 2) Problem when we have tons of reques in our server: Whcih can drain our resources.
  //   fs.readFile("test-file.txt", (err, data) => {
  // If there is any error, send the error object to the console
  // if (err) console.log(err);
  // Otherwise, send the data as response:
  //     res.end(data);
  //   });
  // SOLUTION 2: STREAMS
  //   const readable = fs.createReadStream("./test-file.txt");
  // Streaming the content from the file right to the client. We read one peice -> send to client,  read another peice -> send to client and so on unitl the end of file...
  //   readable.on("data", (chunk) => {
  //     res.write(chunk);
  //   });
  // Handle the finish of data reading (ie. streaming is finished)
  //   readable.on("end", () => {
  //     res.end();
  //   });
  // Handling the error
  //   readable.on("error", (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end("File not found!");
  //   });
  // SOLUTION 3: (TO AVOIDE BACK PRESSURE)
  const readable = fs.createReadStream("./test-file.txt");
  readable.pipe(res);
  // SYNTAX: readableSource.pipe(writableDestination);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
