const fs = require("fs");
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../config.env' });

const Tour = require("../../models/tourModel");

const db_connection = process.env.DB.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

mongoose
  .connect(db_connection)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log('Connection Error: ', err));

// READING FILE

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully imported")
  } catch(err) {
    console.error(err);
  }
  process.exit()
}

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted");
  } catch(err) {
    console.error(err);
  }
  process.exit();
}

if (process.argv[2] === "--import") {
  importData()
} else if (process.argv[2] === "--delete") {
  deleteData()
}

