const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  //before saving the password is hashed in the User model
  //using the pre save hook
  const user = await User.create({ ...req.body });
  //then a JWT is created using the createJWT method
  const token = user.createJWT();
  //then the user and token are sent back to the client
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  //compare passwordu
  const isPasswordCorrect = await user.comparePasswords(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
