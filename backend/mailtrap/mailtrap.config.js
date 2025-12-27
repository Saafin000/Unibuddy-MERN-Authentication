import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525, // you can also use 465 / 587
  auth: {
    user: process.env.MAILTRAP_USER || "f64c336a26364b", // sandbox username
    pass: process.env.MAILTRAP_PASS || "349d5dc9fe8f47", // sandbox password
  },
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Saafin",
};
