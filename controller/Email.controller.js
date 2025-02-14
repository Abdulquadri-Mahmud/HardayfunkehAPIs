
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { errorHandler } from '../utils/errorHandler.js';

dotenv.config();

export const sendContactEmail = async (req, res, next) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return next(errorHandler(403,"All fields are required!"));
    }
    
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Hardayfunkeh Website" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject: "📩 New Message from Hardayfunkeh Website",
            html: `
                <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #d32f2f; text-align: center;">📬 New Message Received</h2>
                <p style="text-align: center; font-size: 16px; color: #444;">You have received a new message from a customer via the Hardayfunkeh website.</p>
                
                <div style="background: #fafafa; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <p><strong>👤 Name:</strong> ${name}</p>
                    <p><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #d32f2f;">${email}</a></p>
                    <p><strong>📝 Message:</strong></p>
                    <p style="background: #f9f9f9; padding: 12px; border-radius: 5px; font-style: italic; color: #333;">"${message}"</p>
                </div>

                <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" />

                <p style="text-align: center; font-size: 14px; color: #777;">
                    📍 This message was sent from the <strong>Hardayfunkeh</strong> website.<br>
                    Please respond promptly to provide excellent customer service. 🚀
                </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ 
            message: "Message sent successfully! We'll get back to you soon.", 
        });

        // return { success: true, message: "Message sent successfully! We'll get back to you soon." };

    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send email." };
    }
};
