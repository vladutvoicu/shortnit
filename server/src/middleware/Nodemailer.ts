import nodemailer from "nodemailer";
import { config } from "../config/config";
import Logging from "../library/Logging";

export const sendPasswordResetEmail = (email: string, resetToken: string) => {
    let transporter = nodemailer.createTransport({
        name: "shortnIt",
        service: "gmail",
        auth: {
            user: config.smtp_credentials.email,
            pass: config.smtp_credentials.password,
        },
    });

    let mailOptions = {
        from: config.smtp_credentials.email,
        to: email,
        subject: "Password reset request",
        text:
            `Hello,\n\nWe received a request for a password change on your shortnit.web.app account.` +
            ` You can reset your password by clicking this link:` +
            ` https://shortnit.web.app/app/password/reset/${resetToken}\n\n` +
            `This link will expire in 12 hours. After that, you'll need to submit a new request in order` +
            ` to reset your password. If you don't want to reset it, simply disregard this email.\n\n` +
            `(Please don't reply to this message; it's automated)\n\nThanks,\nShortnIt`,
    };

    transporter.sendMail(mailOptions, function (error, data) {
        if (error) {
            Logging.error(error);
        } else {
            Logging.info(`Password reset email sent to ${email}`);
        }
    });
};
