import { EmailEnum } from "../enums/email.enum";

export interface IEmailData {
    subject: string;
    template: string;
}

type IEmailConstants<T extends Record<string, string>> = {
    [K in keyof T]: IEmailData;
};

export const EMAIL_DATA: IEmailConstants<typeof EmailEnum> = {
    [EmailEnum.WELCOME]: {
        subject: "Welcome",
        template: "welcome",
    },
    [EmailEnum.VERIFY_USER]: {
        subject: "Please verify your email address",
        template: "user-verification",
    },
    [EmailEnum.RECOVER_PASSWORD]: {
        subject: "Confirm Password Reset",
        template: "recovery-password",
    },

    [EmailEnum.LISTING_STAFF]: {
        subject: "STAFF REQUIRED: Profanity detected",
        template: "listing-check-staff",
    },
    [EmailEnum.CAR_MISSING]: {
        subject: "Missing car requested",
        template: "car-missing",
    },
};
