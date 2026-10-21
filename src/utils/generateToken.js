import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.COOKIE_EXPIRE, 10) || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('token', token, options);

  // Return clean user object without password
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  return { token, user: userObj };
};
