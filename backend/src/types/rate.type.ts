import { CurrencyEnum } from "../enums/currency.enum";

export type PrivatBankRateType = {
    ccy: string;
    base_ccy: string;
    buy: string;
    sale: string;
};

export type NonUAHCurrency = Exclude<CurrencyEnum, CurrencyEnum.UAH>;

export type FormattedRates = {
    [currency in NonUAHCurrency]: {
        buy: number;
        sale: number;
    };
};

export type CurrencyAmountType = {
    amount: number;
    currency: CurrencyEnum;
};
