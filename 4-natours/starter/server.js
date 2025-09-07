const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION');
  process.exit(1);
});

const app = require('./app');

const db_connection = process.env.DB.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

mongoose
  .connect(db_connection)
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION');
  server.close(() => {
    process.exit(1);
  });
});
