import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { MAIL_PASSWORD, MAIL_USERNAME } from 'src/config/env.config';

@Injectable()
export class MailService {
    private transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD
            }
        })
    }

    async sendResetEmail(email: string, resetToken: string) {
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`; // Reemplaza con la URL de tu aplicación para restablecer la contraseña
        await this.transporter.sendMail({
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Restablecer contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetUrl}">Aqui</a></p>`
        })
    }
}