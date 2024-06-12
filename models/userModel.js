// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the user schema
// const userSchema = new Schema({
//   FirstName: {
//     type: String,
//     required: [true, 'First name is required'],
//     minlength: [1, 'First name should have a minimum length of 1'],
//     maxlength: [50, 'First name should have a maximum length of 50'],
//   },
//   LastName: {
//     type: String,
//     required: [true, 'Last name is required'],
//     minlength: [1, 'Last name should have a minimum length of 1'],
//     maxlength: [50, 'Last name should have a maximum length of 50'],
//   },
//   MobileNumber: {
//     type: String,
//     required: [true, 'Mobile number is required'],
//     match: [/^[0-9]{10}$/, 'Mobile number must be a 10-digit number'],
//   },
//   Email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     match: [/.+@.+\..+/, 'Email must be a valid email address'],
//   },
//   Password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [8, 'Password should have a minimum length of 8'],
//     maxlength: [128, 'Password should have a maximum length of 128'],
//   },
// }, {
//   timestamps: true,
// });

// // Create the user model
// const User = mongoose.model('User', userSchema);

// module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
  FirstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [1, 'First name should have a minimum length of 1'],
    maxlength: [50, 'First name should have a maximum length of 50'],
  },
  LastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [1, 'Last name should have a minimum length of 1'],
    maxlength: [50, 'Last name should have a maximum length of 50'],
  },
  MobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Mobile number must be a 10-digit number'],
  },
  Email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Email must be a valid email address'],
  },
  Password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password should have a minimum length of 8'],
    maxlength: [128, 'Password should have a maximum length of 128'],
  },
}, {
  timestamps: true,
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('Password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
