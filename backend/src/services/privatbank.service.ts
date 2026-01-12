import axios from "axios";

import { urls } from "../constants/urls";
import {
    FormattedRatesType,
    NonUAHCurrencyType,
    PrivatBankRateType,
} from "../types/rate.type";

class PrivatBankService {
    public async getRates(): Promise<PrivatBankRateType[]> {
        const { data } = await axios.get<PrivatBankRateType[]>(urls.privatBank);
        return data;
    }

    public async getRatesFormatted(): Promise<FormattedRatesType> {
        const rates = await this.getRates();
        const formattedRates = rates.reduce((acc, rate) => {
            acc[rate.ccy as NonUAHCurrencyType] = {
                buy: Number(rate.buy),
                sale: Number(rate.sale),
            };
            return acc;
        }, {});

        return formattedRates as FormattedRatesType;
    }
}

export const privatBankService = new PrivatBankService();
