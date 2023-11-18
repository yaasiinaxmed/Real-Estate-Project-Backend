import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL;
const pass = process.env.PASS;

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass,
  },
});

export const contactOwner = async (req, res) => {
  try {
    const {
      from_name,
      from_email,
      to_name,
      to_email,
      property_title,
      message,
    } = req.body;

    const mailOptions = {
      from: `${from_name} <${from_email}>`,
      to: `${to_name} <${to_email}>`,
      subject: `New Mesage from The Property: ${property_title}`,
      text: `Message from The Property ${property_title} 
from: ${from_name} - ${from_email} 
message: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ status: 200, message: "Your message has been successfully sent." });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Your message could not be sent" });
  }
};
