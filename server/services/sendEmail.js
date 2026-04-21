const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
   service : "gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
<<<<<<< HEAD
    from:` "FootWear" <${process.env.EMAIL_USER}>`,
=======
    from:` "Digital MOMO" <${process.env.EMAIL_USER}>`,
>>>>>>> f0508147ab85022abb8c8d1d3e42f06a4a0a0e30
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;