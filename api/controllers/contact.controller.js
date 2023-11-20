import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL;
const pass = process.env.PASS;

// create email template
const emailTemplate = (emailBody) => {
  // header email
  const header = `<header style="background: #1E88E5; padding: 10px; text-align: center; color: white;"><h1>Real Estate</h1></header>`;
  // footer email
  const footer = `<footer style="background: #1E88E5; padding: 10px; text-align: center; color: white;"><h5>Real Estate MarketPlace</h1><br/> <p>© 2023 Yaasiin Ahmed - All rigths reserved</p></footer>`;

  // full emailContent
  const emailContent = `${header}<div style="padding: 20px;">${emailBody}</div>${footer}`

  return emailContent
}

// config server gmail
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: pass,
  },
});

// Contact Owner 
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

    const emailBody = `Message from The Property ${property_title}<br/>from: ${from_name} - ${from_email}<br>message: ${message}`

    const template = emailTemplate(emailBody)

    const mailOptions = {
      from: `${from_name} <${from_email}>`,
      to: `${to_name} <${to_email}>`,
      subject: `New Mesage from The Property: ${property_title}`,
      html: template
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ status: 200, message: "Your message has been successfully sent." });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Your message could not be sent" });
  }
};

// Contact Renter
export const contactRenter = async (req, res) => {
  try {
    const {
      from_name,
      from_email,
      to_name,
      to_email,
      property_title,
      message,
    } = req.body;

    const emailBody = `Message from The Property ${property_title}<br/>from: ${from_name} - ${from_email}<br>message: ${message}`

    const template = emailTemplate(emailBody)

    const mailOptions = {
      from: `${from_name} <${from_email}>`,
      to: `${to_name} <${to_email}>`,
      subject: `New Mesage Owner from The Property: ${property_title}`,
      html: template,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ status: 200, message: "Your message has been successfully sent." });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Your message could not be sent" });
  }
}