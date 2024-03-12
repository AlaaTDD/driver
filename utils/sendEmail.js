const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service:"gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'PauApp <AlaaTaha@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
