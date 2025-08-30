const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const app = require('./app');

const db_connection = process.env.DB.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

mongoose
  .connect(db_connection)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log('Connection Error: ', err));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
