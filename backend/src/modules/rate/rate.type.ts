import { CurrencyEnum } from "../../common/enums/currency.enum";

export type PrivatBankRateType = {
    ccy: string;
    base_ccy: string;
    buy: string;
    sale: string;
};

export type NonUAHCurrencyType = Exclude<CurrencyEnum, CurrencyEnum.UAH>;

export type FormattedRatesType = {
    [currency in NonUAHCurrencyType]: {
        buy: number;
        sale: number;
    };
};

export type CurrencyAmountType = {
    mainCurrency?: boolean;
    rate?: number;
    amount: number;
    currency: CurrencyEnum;
};
