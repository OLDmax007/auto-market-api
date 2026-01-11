import { CurrencyEnum } from "../enums/currency.enum";

export type BaseType = {
    createdAt: Date;
    updatedAt: Date;
};

export type CurrencyAmountType = {
    amount: number;
    currency: CurrencyEnum;
};
