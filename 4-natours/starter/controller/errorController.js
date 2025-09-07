const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message || 'Something went wrong!',
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message || 'Something went wrong!',
    });
  } else {
    res.status(err.statusCode).json({
      status: 500,
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV == 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV == 'production') {
    console.log('Error: ', err);
    let error = { ...err };

    if (err.name == 'CastError') error = handleCastErrorDB(error);
    if (err.code == 11000) error = handleDuplicateFieldsDB(error);
    if (err.name == 'ValidationError') error = handleValidationErrorDB(error);
    sendErrProd(error, res);
  }
};
