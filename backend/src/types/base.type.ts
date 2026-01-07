import { CurrencyEnum } from "../enums/currency.enum";

export type BaseType = {
    createdAt: Date;
    updatedAt: Date;
};

export type CurrencyType = {
    amount: number;
    currency: CurrencyEnum;
};
