// FS(File System) modules allows us to interact with the files in our system
const fs = require("fs");
const http = require("http");
const url = require("url");

// Third Party Modules (from NPM)
const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

/////////////////////////////////////////////////////
// FILES
//  Blocking, Synchronous Way
// Reading a text file using fs module
// const textIn =fs.readFileSync("./txt/input.txt","utf-8");
// console.log(textIn);

// Writing a text to a file
// fs.writeFileSync("./txt/output.txt",`This is what we know about avocado: ${textIn}.\nCompiled in: ${Date.now()}`);
// console.log("\n→Text writeen successfully!----👍");

// Non-Blocking, Asynchronous Way

// fs.readFile('./txt/startttt.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log('Error 💥');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(`Time Stamp 1: ${Date.now()}. Actal Data: ${data2}\n`);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(`Time Stamp 3: ${data3}`)

//             // Writing to the file:
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log('📝Your file has been written✍️')
//             })
//         })
//     })
// })

// console.log(`Time Stamp 2: ${Date.now()}.This is outside the Asynchronouse block of code.`);

/////////////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productDataObject = JSON.parse(data);

// Using Slugify to create slugs out of the product name
const slugs = productDataObject.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);

console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  console.log(`Request Method: ${req.method}`); // Logs the HTTP method
  console.log(`Request URL: ${pathname}`); // Logs the request
  console.log(url.parse(req.url, true));

  // Set headers
  res.setHeader("Content-Type", "text/plain");

  res.statusCode = 200;

  // Responds to the request
  // Using the concept of Routing

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    const cardsHtml = productDataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    // Finding the actual product we need.
    const product = productDataObject[query.id];

    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  }

  // Handling the exection for not existing route
  // Not Found
  else {
    // # Header should be sent before we send the response
    // Sending header with response
    res.writeHead("404", {
      "Content-type": "text/html",
      //custom header
      "my-custom-header": "this_Is_My_Custom_Header",
    });

    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to the request on port 8000");
});
