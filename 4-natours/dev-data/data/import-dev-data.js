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
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

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
