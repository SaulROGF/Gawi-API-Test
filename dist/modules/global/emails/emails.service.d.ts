import { ServerMessage } from '../../../classes/ServerMessage.class';
import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailsService {
    private readonly mailerService;
    srcEmail: string;
    constructor(mailerService: MailerService);
    welcome(userEmail: string, userName: string): Promise<ServerMessage>;
    resetPassword(currentEmail: string, newPassword: string): Promise<ServerMessage>;
    recoveryPassword(email: string, link: string): Promise<ServerMessage>;
    convertDateToUTC(date: Date): Date;
    sendSubscriptionPaymentSuccessEmail(name: string, toEmail: string, product: string, valid: string, reference: string, amount: string, type: number, commentForUser: string): Promise<ServerMessage>;
}
