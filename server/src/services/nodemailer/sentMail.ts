import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: 'wreflectteam@gmail.com',
    pass: 'Domaybiet!23',
  },
});

const options = {
  from: 'wreflectteam@gmail.com',
  to: 'tan.187pm20569@vanlanguni.vn',
  subject: 'testing and testing',
  text: 'Your account was hacked, sorry u must follow this link to validate',
};

transporter.sendMail(options, (err, data) => {
  if (err) {
    console.log('have error');
  } else {
    console.log('send mail successfully', data);
  }
});
