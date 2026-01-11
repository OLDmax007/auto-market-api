import { CurrencyEnum } from "../enums/currency.enum";
import { privatBankService } from "./privatbank.service";

class PricingService {
    public async convertToUAH(
        money: number,
        currency: CurrencyEnum,
    ): Promise<number> {
        if (currency === CurrencyEnum.UAH) {
            return money;
        }
        const rates = await privatBankService.getRates();
        const rate = rates.find((rate) => rate.ccy === currency);
        return money * Number(rate.sale);
    }
}

export const pricingService = new PricingService();
