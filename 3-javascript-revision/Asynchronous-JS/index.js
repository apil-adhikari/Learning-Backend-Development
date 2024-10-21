/* DEMONSTRATION USING CALLBACK

const fs = require("fs");
const superagent = require("superagent");

fs.readFile(`${__dirname}/dog.txt`, "utf-8", (err, data) => {
  console.log(`Breed: ${data}`);

  //#region : Using superagent for doing http request
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      //#region ERROR HANDLING if no dog breed is found then return from the function right away else the function will continue running
      if (err) return console.log(err.message);
      //#endregion: End of ERROR HANDLING if no dog breed found

      console.log(res.body.message);

      //#region : Writing the data to the file
      fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, (err) => {
        console.log("Random dog image saved to the file");
      });
      //#endregion: Complete of data writing
    });

  //#endregion: End of http request
});
*/

/* PROMISE DEMONSTRATION
const fs = require("fs");
const superagent = require("superagent");

fs.readFile(`${__dirname}/dog.txt`, "utf-8", (err, data) => {
  console.log(`Breed: ${data}`);

  // Using superagent

  /**
   * superagent.get() returns a promise.
   * Promise can be fulfilled or rejected.
   * A promise is said to be settled if it is either fulfilled or rejected, but not pending.
   * If successfully fulfilled we can call .then() method on it.
   * If rejected, we call .catch method in it.
   
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((resolvedValue) => {
      console.log(resolvedValue.body.message);

      // We can write to the file
      fs.writeFile(
        `${__dirname}/dog-img.txt`,
        resolvedValue.body.message,
        "utf-8",
        (err) => {
          if (err) return console.log(err.message);

          console.log("Random 🐶 image saved successfully!");
        }
      );
    })
    .catch((err) => {
      console.log(err.message);
    });
});
*/

/*
// Bulding promise

const fs = require("fs");
const superagent = require("superagent");

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find that file!!!");
      resolve(data);
    });
  });
};

const writeFilePromise = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileName, "utf-8", (err) => {
      if (err) reject(err.message);
      resolve("Success");
    });
  });
};

readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((resolvedValue) => {
    console.log(resolvedValue.body.message);
    return writeFilePromise(
      `${__dirname}/dog-img.txt`,
      resolvedValue.body.message
    );
  })
  .then(() => {
    console.log("Random dog image saved successfully!!!");
  })
  .catch((err) => { 
    console.log(err);
  });
*/

// Consuming Promises with AsyncAwait
const fs = require("fs");
const superagent = require("superagent");

// Promisify file read and write
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("I could not find that file!!!");
      resolve(data);
    });
  });
};

const writeFilePromise = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileName, "utf-8", (err) => {
      if (err) reject(err.message);
      resolve("Success");
    });
  });
};

const getDogPic = async () => {
  try {
    // 1) Read the file
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    // 2) After reading, use api to get the dog image
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    console.log("-----------------------------------------");
    // --Waiting for multiple promises:

    /**
     * Dont use awiat keyword but store the result in different varialbes
     * at lats use one varialbe to store all results in form of array and awiat them
     * eg: const all = await Promise.all([res1Promise, res2Promise, res3Promise,...])
     */

    const res1Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res2Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res3Promise = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Promise, res2Promise, res3Promise]);

    const imgs = all.map((el) => el.body.message);
    console.log(imgs);
    await writeFilePromise(
      `${__dirname}/dog-combined-imgs.txt`,
      imgs.join("\n")
    );
    console.log("-----------------------------------------");

    // 3) After getting the dog image, write it to the file
    await writeFilePromise(`${__dirname}/dog-img.txt`, res.body.message);
    console.log("Random dog image saved successfully!!!");
  } catch (err) {
    console.log(err);
    throw err; // What if we get error, we need to thwor
  }
  return "2: Ready 🐶";
};

/* This lead to using AsyncAwait with Promise .then() and .catch()
console.log("1: Will get dog pics.");
getDogPic()
  .then((x) => {
    console.log(x); // Promise
    console.log("3: Done getting dog pics.");
  })
  .catch((err) => {
    console.log("ERROR 💥");
    });
    
    */

// We can use IIFE (Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is defined
(async () => {
  try {
    console.log("1: Will get dog pics.");
    const x = await getDogPic();
    console.log(x);
    console.log("3: Done getting dog pics.");
  } catch (err) {
    console.log("ERROR 💥");
  }
})();
