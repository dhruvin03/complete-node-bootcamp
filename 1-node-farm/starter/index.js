const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

/********* FILE ********/
// Blocking, synchronous process
//const text = fs.readFileSync('./txt/input.txt', 'utf-8');
//console.log(text);

//const todayDate = Date.now();
//const outputText = `This is all we know about avacados: ${text}.\nCreated on ${new Date(todayDate).toDateString()}`
//fs.writeFileSync('./txt/output.txt', outputText);
//console.log('File written')

// Non-blocking, asynchronous process
//fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//if (err) return console.error('Error 1: ', err);
//fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//if (err) return console.error('Error 2: ', err);
//console.log(data2)
//fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//if (err) return console.error('Error 3: ', err);
//console.log(data3)

//fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//if (err) return console.error('Was not able to write the file.');
//console.log('File is written')
//})
//})
//})
//})
//console.log('Will read the file!');

/********* SERVER ********/
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

const slugs = productData.map((product) =>
  slugify(product.productName, { lower: true }),
);
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname == "/overview" || pathname == "/") {
    const cardHTML = productData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARD%}", cardHTML);

    res.writeHeader(200, {
      "Content-Type": "text/html",
    });
    res.end(output);
  } else if (pathname === "/product") {
    const product = productData.filter((el) => query.id == el.id)[0];
    const output = replaceTemplate(tempProduct, product);

    res.writeHeader(200, {
      "Content-Type": "text/html",
    });
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHeader(200, {
      "Content-Type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHeader(404, {
      "Content-Type": "text/html",
    });
    res.end("<h1>Page Not Found!</h1>");
  }
});

server.listen(8000, "localhost", () => {
  console.log("Server Listening on port 8000");
});
