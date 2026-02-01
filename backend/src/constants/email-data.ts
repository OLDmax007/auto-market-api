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
};
