const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser['_id']);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are present
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password provided', 401));
  }

  const token = signToken(user['_id']);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = '';
  // Check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }
  // Verify token
  const decodedVal = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const user = await User.findById(decodedVal.id);

  if (!user) {
    return next(new AppError('User does not exist', 401));
  }
  // Check if user changed password after the token was issued
  if (user.changePasswordAfter(decodedVal.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTES
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Fetch user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user found with this email', 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send it to users email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot Your Password?\n\nSubmit a PATCH request with password and passwordConfirm to: ${resetUrl}.\n\nIf you didn't forget password then ignore it!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password Reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Email with Reset Token sent!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email.Try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  console.log('Hash token: ', hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: { $gt: Date.now() }
  });

  //const user = await User.findOne({
    //passwordResetToken: hashToken,
    //passwordResetExpiresAt: { $gt: Date.now() },
  //});
  console.log("User: ", user);

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 500));
  }

  // If user present and token not expired the set new password and delete reset tokens.
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  // Log the user IN, and send JWT token
  const token = signToken(user['_id']);

  res.status(200).json({
    status: 'success',
    token,
  });
});
