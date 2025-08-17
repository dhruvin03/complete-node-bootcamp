const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();
let stockLeft = 9;

if (stockLeft > 0) {
  myEmitter.on("newSale", () => {
    stockLeft -= 1;
    console.log("There was a new sale!");
  });

  myEmitter.on("newSale", () => {
    console.log("Customer Name: Dhruvin");
  });

  myEmitter.on("newSale", (stock) => {
    console.log(`There are now ${stock} items left in stock`);
  });
} else {
  myEmitter.on("newSale", () => {
    console.log("Product is out of stock");
  });
}

myEmitter.emit("newSale", stockLeft);

/////////////////////////////////////////////////////////////////////////////////////////
const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request Recieved!");
  console.log(req.url)
  res.end("Request Recieved!");
});

server.on("request", (req, res) => {
  console.log("Another Request Recieved!");
});

server.on("close", () => {
  console.log("Server Closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests...");
});

