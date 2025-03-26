const nodemailer = require("nodemailer");
const { _mailPass, _mailHost, _mailUser } = require("../globals/secretKey");
const { responseStatus } = require("../globals/handler");

const mailSender = async (options, res) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: _mailHost,
      auth: {
        user: _mailUser,
        pass: _mailPass,
      },
    });
    let info = await transporter.sendMail({
      to: options.email,
      subject: options.title,
      html: options.message,
    });
    return responseStatus(
      res,
      200,
      "success",
      `Please check ${options.email}. Your code is 6 numbers long.`
    );
  } catch (error) {
    return responseStatus(res, 400, "failed", error.message);
  }
};
module.exports = { mailSender };
