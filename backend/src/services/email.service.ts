import fs from "node:fs/promises";
import path from "node:path";

import handlebars from "handlebars";
import { createTransport, Transporter } from "nodemailer";

import { mainConfig } from "../configs/main.config";
import { IEmailData } from "../constants/email-data.constants";

class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            service: "gmail",
            auth: {
                user: mainConfig.EMAIL_USER,
                pass: mainConfig.EMAIL_PASSWORD,
            },
        });
    }

    private _renderTemplate = async (
        template: string,
        context: Record<string, any>,
    ): Promise<string> => {
        const basePath = path.join(process.cwd(), "src", "templates");

        const layoutSource = await fs.readFile(
            path.join(basePath, "base.hbs"),
            "utf-8",
        );

        const layoutTemplate = handlebars.compile(layoutSource);
        const templateSource = await fs.readFile(
            path.join(basePath, `${template}.hbs`),
            "utf-8",
        );

        const childTemplate = handlebars.compile(templateSource);
        const childHtml = childTemplate(context);
        return layoutTemplate({ body: childHtml });
    };

    public sendEmail = async (
        to: string,
        emailData: IEmailData,
        context: Record<string, any>,
    ): Promise<void> => {
        try {
            await this.transporter.sendMail({
                to,
                subject: emailData.subject,
                html: await this._renderTemplate(emailData.template, context),
            });
        } catch (error: any) {
            if (error.code === "EENVELOPE") {
                console.error(
                    `Email error: Invalid recipient address - "${to}"`,
                );
            }
            console.error(`Email error: ${error.message}`);
        }
    };
}
export const emailService = new EmailService();
