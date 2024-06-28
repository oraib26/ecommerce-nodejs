import nodemailer from "nodemailer";
import { emailTemplet } from "./emailTemplet.js";

export async function sendEmail(to, subject, userName = "", token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILSENDER,
      pass: process.env.PASSWORDSENDER,
    },
  });

  const info = await transporter.sendMail({
    from: `"O-Shop" <${process.env.EMAILSENDER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html: emailTemplet(to, userName, token),
  });

  return info;
}
