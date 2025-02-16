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

---

# What Are Mongoose > <b><i>Virtual Properties</b></i>?

In Mongoose, virtual properties are fields that are not stored in the database but are derived from other data or computed dynamically. Virtuals are typically used for things like formatting, combining fields, or adding computed values to our documents.

They are defined in a schema and allow us to add logical properties to our model without persisting them to the MongoDB collection.

## Key Characteristics of Virtuals

1. <b>Not Stored in MongoDB:</b> Virtuals exist only in the application and are not saved in the database.
2. <b>Derived Properties:</b> They are often computed based on other fields in the document.
3. <b>Getter and Setter Support:</b> Virtuals can define:

- A getter to compute the value dynamically.
- A setter to update other fields based on the value passed to the virtual.

4. <b>Use in JSON or Object Outputs:</b> You can choose to include virtuals when documents are converted to JSON or plain objects (via `.toJSON()` or `.toObject()`).

NOTE: Virtual Properties cannot be used with `query` as they are not the part of our database.

#### Example Code:

```JavaScript
const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema({
  firstName: string,
  lastName: string,
},
// We also need to pass these other schema options in the schema: Defining additional Schema Options to display the virtual properties each time data when data is requested with .get() request & is outputed as JSON or as an Object. ie. we want virtuals to be the part of output.
{
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
}
);

// Define virtual properties on the schema
userSchema.virtual('fullName).get(function(){
return `${this.firstName} ${this.lastName}`
});

// Create a modle
const User = mongoose.model('User', userSchema);

// Test Example:
const user = new User({firstName: 'John', lastName: 'Doe' });
console.log(user.fullName); // Output should be: "John Doe"
```

# Mongoose Middlewares

Mongoose middleware (also called pre and post hooks) is a powerful feature that allows you to define functions that are executed at specific points during the lifecycle of a Mongoose document or query. These hooks let you intercept and run logic before or after certain actions, like saving, validating, updating, or deleting documents.

# Mongoose Middleware: Types and Overview

Mongoose middleware can be categorized into **four types** based on their scope and the operations they affect: **document, query, aggregate, and model middleware**. Here's an overview of each type:

---

## **1. Document Middleware**

Document middleware is executed on individual Mongoose documents. It applies to operations like saving, validating, and removing documents.

### Examples:

- **`save`**: Runs before (`pre`) or after (`post`) a document is saved.
- **`validate`**: Runs before a document is validated.
- **`remove`**: Runs before or after a document is removed.

### Use Case:

- Preprocess or validate document data before saving.
- Automatically hash passwords or update timestamps.

### Example:

```javascript
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12); // Hash password
  }
  next();
});
```

---

## **2. Query Middleware**

Query middleware is executed on Mongoose queries. It applies to operations like `find`, `findOne`, `updateMany`, and `findOneAndUpdate`.

### Examples:

- **`find`**: Runs before (`pre`) or after (`post`) any `find` query.
- **`findOne`**, **`findOneAndUpdate`**, **`updateMany`**.

### Use Case:

- Filter out certain data (e.g., exclude secret fields).
- Add default conditions to queries.

### Example:

```javascript
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // Exclude secret tours
  next();
});
```

---

## **3. Aggregate Middleware**

Aggregate middleware is executed on Mongoose aggregation pipelines. It applies to operations like `aggregate()`.

### Use Case:

- Modify or filter data before running an aggregation pipeline.
- Automatically exclude sensitive data or apply global filters.

### Example:

```javascript
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // Exclude secret tours
  next();
});
```

Here, the middleware adds a `$match` stage at the beginning of the pipeline to filter out secret tours.

---

## **4. Model Middleware**

Model middleware is executed on Mongoose static methods or actions that interact with the model directly, such as `insertMany()`.

### Use Case:

- Customize behavior for operations like `insertMany`.
- Enforce rules or manipulate data during batch inserts.

### Example:

```javascript
userSchema.pre('insertMany', function (next, docs) {
  console.log('Inserting multiple documents:', docs);
  next();
});
```

> **Note:** Document middleware (like `save`) does not run during `insertMany`. If you want custom logic for batch inserts, use **model middleware**.

---

## **Key Differences Between Middleware Types**

| **Middleware Type** | **Runs On**                                 | **Pre/Post Hooks** | **Common Use Cases**                     |
| ------------------- | ------------------------------------------- | ------------------ | ---------------------------------------- |
| **Document**        | Individual documents (e.g., `save`)         | `pre`, `post`      | Hashing passwords, updating timestamps   |
| **Query**           | Queries (e.g., `find`, `update`)            | `pre`, `post`      | Filtering, logging, or modifying queries |
| **Aggregate**       | Aggregation pipelines (e.g., `aggregate`)   | `pre`, `post`      | Adding filters to pipelines              |
| **Model**           | Model-level operations (e.g., `insertMany`) | `pre`, `post`      | Batch inserts, logging, or manipulation  |

---

## **Middleware Workflow**

1. **Pre-Hook**: Runs _before_ the action (e.g., before a document is saved or a query is executed).
2. **Action**: Executes the main operation (e.g., saving a document or executing a query).
3. **Post-Hook**: Runs _after_ the action (e.g., after a document is saved or a query is executed).

---

## **Important Notes**

- Middleware must call `next()` to proceed to the next stage in the lifecycle (for `pre` hooks).
- Middleware is **asynchronous** if it returns a promise or uses `async/await`.
- Document middleware (like `save`) does **not** trigger on `insertMany` or query-level methods.

---

## **Conclusion**

Mongoose middleware gives you incredible flexibility to automate and manage operations across your MongoDB application. Understanding the **four types of middleware** (document, query, aggregate, and model) helps you implement the right hook at the right time for preprocessing, validation, filtering, or logging.
