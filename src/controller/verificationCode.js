const uuid = require('uuid');
const sendVerificationEmail = require('./emailVerification');

// Create a registration function
const registerUser = (email, password, name) => {
  // Generate a unique verification token
  const verificationToken = uuid.v4();

  // Save the user data and verification token to your database
  // ...

  // Generate the verification link
  const verificationLink = `https://yourwebsite.com/verify/${verificationToken}`;

  // Send the verification email
  sendVerificationEmail(email, verificationLink);
};