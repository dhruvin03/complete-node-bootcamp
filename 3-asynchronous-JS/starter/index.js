const fs = require("fs");
const superagent = require("superagent");

const myReadFile = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("File Not Found!!!");
      resolve(data);
    });
  });
};

const myWriteFile = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Could not write data to a file!!!");
      resolve("success");
    });
  });
};

//////// Async/Await /////////
const getDogPic = async () => {
  try {
    const resp = await myReadFile(`${__dirname}/dog.txt`);
    console.log(`Breed: ${resp}`);

    const resp1 = superagent.get(
      `https://dog.ceo/api/breed/${resp}/images/random`,
    );
    const resp2 = superagent.get(
      `https://dog.ceo/api/breed/${resp}/images/random`,
    );
    const resp3 = superagent.get(
      `https://dog.ceo/api/breed/${resp}/images/random`,
    );

    const all = await Promise.all([resp1, resp2, resp3]);
    const images = all.map(data => data.body.message);
    console.log('Images: ', images);

    await myWriteFile(`${__dirname}/dog-img.txt`, images.join("\n"));
    console.log("Random dog image saved to file!");
  } catch (err) {
    console.error(err);
    throw err;
  }
  return "2: READY";
};

(async () => {
  try {
    console.log("1: Will get dog pics");
    let x = await getDogPic();
    console.log(x);
    console.log("3: Done getting dog pics");
  } catch (err) {
    console.error("Error: ", err);
  }
})();

/////// Promise /////////
//myReadFile(`${__dirname}/dog.txt`)
//.then((resp) => {
//console.log(`Breed: ${resp}`);
//return superagent.get(`https://dog.ceo/api/breed/${resp}/images/random`);
//})
//.then((resp1) => {
//console.log(resp1.body.message);
//return myWriteFile(`${__dirname}/dog-img.txt`, resp1.body.message);
//})
//.then((resp2) => {
//console.log("Random dog image saved to file!");
//})
//.catch((err) => {
//console.error(err);
//});
