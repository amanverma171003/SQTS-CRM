require("dotenv").config()
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const sendMail = async (to, subject, htmlContent) => {

  try {

    await transporter.sendMail({
      from: `"SQTS CRM" <${process.env.MAIL_FROM}>`,
      to,
      subject,
      html: htmlContent
    })

    console.log("EMAIL SENT")

  } catch (error) {

    console.error("MAIL ERROR:", error)
    throw error

  }

}

module.exports = sendMail