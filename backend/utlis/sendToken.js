// Create Token and save it to Cookie

export default (user, statuscode, res, message) => {
  // Create JWT Token
  const token = user.getJwtToken();

  // Option for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRED_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statuscode).cookie("token", token, options).json({
    message,
    token,
  });
};
