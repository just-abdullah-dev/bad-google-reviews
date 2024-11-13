import nodemailer from "nodemailer";

function checkResponse(response) {
  const successMessagePattern = /\bOK\b/;
  if (successMessagePattern.test(response)) {
    return true;
  } else {
    return false;
  }
}

export async function sendMail(email, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: process.env.SITE_EMAIL,
        pass: process.env.MAIL_APP_PASS_KEY,
      },
    });

    const info = await transporter.sendMail({
      from: {
        name: "25 Euro Loeschung",
        address: process.env.SITE_EMAIL,
      },
      to: email,
      subject: subject,
      html: `<p>${message}</p>`,
    });
    console.log(info);
    return { success: checkResponse(info?.response), data: info };
  } catch (error) {
    console.log(error);
  }
}
