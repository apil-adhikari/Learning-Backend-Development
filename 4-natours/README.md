## Refactoring our Routes

OLD: app.method('path', request handler function) -> Seprating Request handler function from here and keeping this in seprate place

```javascript
app.method('path', functionName);
```

## SETTING UP ESLINT + PRETTIER IN VSCODE

1. Install Prettier
2. Install ESLint

Install following DEV Dependencies:

    npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev

## Error: listen EADDRINUSE: address already in use :::<PORT>

Run CMD as an ADMINISTRATO

    taskkill /F /IM node.exe

If this doesnot work then use following:

If there is an error of address already in use when starting the server in Express, we can do like this to resolve the problem in windows machine.

REM Replace <PORT> with your target port number

    netstat -ano | findstr :<PORT>

REM Replace <PID> with the PID found in the previous command output

    tasklist /FI "PID eq <PID>"

REM Replace <PID> with the same PID to terminate the process

    taskkill /PID <PID> /F

## Duplicate Key Error even if <i> schemaType </i> `unique: false`

### [Solution 1: StackOverFlow](https://stackoverflow.com/questions/24430220/e11000-duplicate-key-error-index-in-mongodb-mongoose)

This solution still works in 2023 and you don't need to drop your collection or lose any data.
Here's how I solved same issue in September 2020. There is a super-fast and easy way from the mongodb atlas (cloud and desktop). Probably it was not that easy before? That is why I feel like I should write this answer in 2020.

First of all, I read above some suggestions of changing the field "unique" on the mongoose schema. If you came up with this error I assume you already changed your schema, but despite of that you got a 500 as your response, and notice this: specifying duplicated KEY!. If the problem was caused by schema configuration and assuming you have configurated a decent middleware to log mongo errors the response would be a 400.

Why this happens (at least the main reason)
Why is that? In my case was simple, that field on the schema it used to accept only unique values but I just changed it to accept repeated values. Mongodb creates indexes for fields with unique values in order to retrieve the data faster, so on the past mongo created that index for that field, and so even after setting "unique" property as "false" on schema, mongodb was still using that index, and treating it as it had to be unique.

How to solve it
Dropping that index. You can do it in 2 seconds from Mongo Atlas or executing it as a command on mongo shell. For the sack of simplicity I will show the first one for users that are not using mongo shell.

Go to your collection. By default you are on "Find" tab. Just select the next one on the right: "Indexes". You will see how there is still an index given to the same field is causing you trouble. Just click the button "Drop Index". Done.

So don't drop your database everytime this happens
I believe this is a better option than just dropping your entire database or even collection. Basically because this is why it works after dropping the entire collection. Because mongo is not going to set an index for that field if your first entry is using your new schema with "unique: false".

## Script to `IMPORT` data in DB & `DELETE` data from DB

```JS
const fs = require('fs');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

// Loading config.env file's data to process.env
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
'<DB_PASSWORD>',
process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connected successfully!'));

// READ JSON FILE
const tours = JSON.parse(
fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMPORT DATAT INTO DATABASE-------------------------
const importData = async () => {
try {
console.log('Importing data from the file system');
await Tour.create(tours);
console.log('Data Successfully Imported!!');
} catch (err) {
console.log('Error importing data:', err.message);
console.log('Full Error Details:', err);
}

// process.exit(); //Ensuring the process exit after execution
};

// DELETE ALL DATA FROM DB COLLECTION-------------------------
const deleteData = async () => {
try {
console.log('Deleteing all data in collections');
await Tour.deleteMany();
console.log('Data Successfully Deleted!!');
} catch (err) {
console.log(err);
}

process.exit(); //Ensuring the process exit after execution
};

if (process.argv[2] === '--import') {
importData();
} else if (process.argv[2] === '--delete') {
deleteData();
} else {
console.log('Invalid Command. Please use --import or --delete.');
}

console.log(process.argv);
```

### When IMPORTING data, this type of validation error may occur due to the `testing data` that we have used before in the FIlE based API: So delete those data and use the `--import` script again

Error importing data: Tour validation failed: imageCover: A tour must have an cover image, summary: A tour must have a description, price: A tour must have a price, maxGroupSize: A tour must have a group size
Full Error Details: Error: Tour validation failed: imageCover: A tour must have an cover image, summary: A tour must have a description, price: A tour must have a price, maxGroupSize: A tour must have a group size

```JS
{ "id": 9, "name": "test tour 1", "duration": 8, "difficulty": "medium" },
  { "id": 10, "name": "test tour 2", "duration": 5, "difficulty": "hard" },
  {
    "id": 11,
    "name": "test tour 3 updated",
    "duration": 10,
    "difficulty": "medium",
    "description": "Updated test tour 3 JUST NOW"
  },
  {
    "id": 12,
    "name": "test tour 4",
    "price": 499,
    "duration": 10,
    "difficulty": "medium",
    "description": "This is newly added tour"
  }
```
