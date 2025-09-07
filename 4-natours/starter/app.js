const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controller/errorController');

const app = express();

/***** Middleware *****/
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  const start = Date.now();
  const requestTime = new Date().toISOString();

  res.on('finish', () => {
    const end = Date.now();
    const duration = end - start;
    console.log(
      `[INFO] ${requestTime} | ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${duration}ms`,
    );
  });

  // When an error happens
  res.on('error', (err) => {
    console.error(
      `[ERROR] ${new Date().toISOString()} | ${req.method} ${req.url} | Error: ${err.message}`,
    );
  });

  next();
});

/***** Routes *****/
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  //let err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  //err.statusCode = 404;
  //err.status = 'failed';

  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
