const nodemailer = require("nodemailer");

const mailHelper = async (option) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "311aeafd00fc85",
          pass: "d7aa6a168de02d"
        }
      });



  const message = {
    from: "sujay@startup.dev", // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.message, // plain text body
  };

  // send mail with defined transport object
  await transporter.sendMail(message);
};

module.exports = mailHelper;
