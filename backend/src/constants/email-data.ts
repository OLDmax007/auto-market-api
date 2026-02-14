import { EmailEnum } from "../enums/email.enum";

export interface IEmailData {
    subject: string;
    template: string;
}

type IEmailConstants<T extends Record<string, string>> = {
    [K in keyof T]: IEmailData;
};

export const emailConstants: IEmailConstants<typeof EmailEnum> = {
    [EmailEnum.WELCOME]: {
        subject: "Welcome",
        template: "welcome",
    },
    [EmailEnum.LISTING_CHECK]: {
        subject: "New Listing for Review",
        template: "listing-check",
    },
    [EmailEnum.LISTING_CREATED]: {
        subject: "New Listing Created",
        template: "listing-created",
    },
    [EmailEnum.VERIFY_USER]: {
        subject: "Please verify your email address",
        template: "user-verification",
    },
    [EmailEnum.RECOVER_PASSWORD]: {
        subject: "Confirm Password Reset",
        template: "recovery-password",
    },
};
