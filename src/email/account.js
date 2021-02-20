const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "me.tanveer@outlook.com",
    pass: process.env.OUTLOOK_PASSWORD,
  },
});

const sendWelcomeMail = (name, email) => {
  const mailOptions = {
    from: "me.tanveer@outlook.com",
    to: email,
    subject: "Welcome to the Task Manager App",
    text:
      `Hi ${name},` +
      `Thanks for joining us. Hope you'll now be able to manage yours tasks better` +
      `-Task manager app team`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendDeleteMail = (name, email) => {
  const mailOptions = {
    from: "me.tanveer@outlook.com",
    to: email,
    subject: "Hope you'll come back soon!",
    text:
      `Hi ${name},` +
      `We're much saddened that you're leaving us. Pls help us improving our service so that we can serve you better next time` +
      `-Task manager app team`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendWelcomeMail,
  sendDeleteMail,
};
