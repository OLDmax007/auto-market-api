import axios from "axios";

import { urls } from "../constants/urls";
import { CurrencyEnum } from "../enums/currency.enum";
import { PrivatBankRateType } from "../types/billing/privatbank-rate.type";

class PrivatBankService {
    public async getRates(): Promise<PrivatBankRateType[]> {
        const { data } = await axios.get<PrivatBankRateType[]>(urls.privatBank);
        return data;
    }

    public async convertToUAH(
        money: number,
        currency: CurrencyEnum,
    ): Promise<number> {
        if (currency === CurrencyEnum.UAH) {
            return money;
        }
        const rates = await this.getRates();
        const rate = rates.find((rate) => rate.ccy === currency);
        return money * Number(rate.sale);
    }
}

export const privatBankService = new PrivatBankService();
