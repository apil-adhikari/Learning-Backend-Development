const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// new Email(user, url).sendWelcome()

// CREATING A ROBUST EMAIL HANDLEAR
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Apil Adhikari ${process.env.EMAIL_FROM}`;
  }

  // CREATING TRANSPORTER OBJECT
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // GMAIL
      return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_SMPT_EMAIL,
          pass: process.env.GMAIL_SMPT_EMAIL_PASSWORD,
        },
      });
    }

    // NODEMAILER FOR DEVELOPMENT ENVIORNMENT
    return nodemailer.createTransport({
      // service: 'Gmail', //This is popular option but gmail might mark us a spammers, so we use different service
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // SEND THE ACTUAL EMAIL
    // 1)Render HTML base on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // 3) CREATE A TRANSPORT AND SEND EMAIL
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcomeTemplate', 'Welcome to the GhumGham Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordResetTemplate',
      'Your password reset token(valid for only 10 minutes)',
    );
  }
};
