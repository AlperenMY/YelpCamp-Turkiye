const nodemailer = require("nodemailer");

const config = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "yelpcampturkiye@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(config);

exports.sendMail = async (to, token, hostname) => {
  const verifyLink = `http://${hostname}/verifyemail?token=${token}`;
  const info = await transporter.sendMail({
    from: "yelpcampturkiye@gmail.com", // sender address
    to, // list of receivers
    subject: "Verify Email", // Subject line
    text:
      "Welcome to YelpCamp Turkiye.\r\n Thank you for registering. You should verify your email in order to use YelpCamp Turkiye \r\n" +
      verifyLink, // plain text body
    html: `<b>Welcome to YelpCamp Turkiye</b><p>Thank you for registering. You should verify your email in order to use YelpCamp Turkiye</p><a href="${verifyLink}">Verify Email</a>`, // html body
  });
  console.log(info);
  console.log(verifyLink);
};
