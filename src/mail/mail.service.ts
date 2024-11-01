import * as nodemailer from 'nodemailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USERNAME } from 'src/config/env.config';

@Injectable()
export class MailService {
    private transporter
    
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            secure: false,
            auth: {
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
            }
        })
    }
    
    
    async sendResetEmail(email: string, resetToken: string) {
        const webhookURL = `http://localhost:3000/reset-password` // change this to your webhook URL, where you want to send the reset link

        const resetUrl = `${webhookURL}?token=${resetToken}`; 
        
        
        try{
            await this.transporter.sendMail({
                from: MAIL_USERNAME,
                to: email,
                subject: 'Restablecer contraseña',
                text: `Hace clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
                html: `
                <p>Hace clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetUrl}">Aqui</a></p>
                <p>O copia y pega este enlace en tu navegador: ${resetUrl}</p>`
            })
        } catch (error) {
            console.log(error);
            throw new BadRequestException('Error al enviar el correo');
            
        }
    
    }
}