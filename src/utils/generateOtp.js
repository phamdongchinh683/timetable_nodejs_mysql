const generateOtp = () => {
  let otpSize = 6;
  let otp = "";
  for (let i = 0; i < otpSize; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

module.exports = { generateOtp };
