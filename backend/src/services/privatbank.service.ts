import axios from "axios";

import { urls } from "../constants/urls";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { rateRepository } from "../repositories/rate.repository";
import {
    FormattedRatesType,
    NonUAHCurrencyType,
    PrivatBankRateType,
} from "../types/rate.type";

class PrivatBankService {
    public async getRates(): Promise<PrivatBankRateType[]> {
        const { data } = await axios.get<PrivatBankRateType[]>(urls.privatBank);

        if (!data?.length) {
            throw new ApiError(HttpStatusEnum.NOT_FOUND, "Rates not found");
        }

        return data;
    }
    public async getRatesFormatted(): Promise<FormattedRatesType> {
        const rates = await rateRepository.getAll();
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
