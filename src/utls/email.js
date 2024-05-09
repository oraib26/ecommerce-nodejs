import nodemailer from "nodemailer";

export async function sendeEmail (to, subject, html){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          user: `${process.env.EMAILSENDER}`,
          pass: `${process.env.EMAILPASSWORD}`,
        },
        
      });
      const info = await transporter.sendMail({
        from: `O shop ${process.env.EMAILSENDER}`, // sender address
        to,
        subject,
        html
      });  
      return info;


} 

