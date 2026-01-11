import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { CurrencyAmountType } from "../types/rate.type";
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
    public async calculateListingPrices(
        money: number,
        currency: CurrencyEnum,
    ): Promise<CurrencyAmountType[]> {
        const { USD, EUR } = await privatBankService.getRatesFormatted();

        const prices = [] as CurrencyAmountType[];

        switch (currency) {
            case CurrencyEnum.UAH:
                prices.push({
                    currency: CurrencyEnum.UAH,
                    amount: money,
                });
                prices.push({
                    currency: CurrencyEnum.USD,
                    amount: money / USD.sale,
                });
                prices.push({
                    currency: CurrencyEnum.EUR,
                    amount: money / EUR.sale,
                });
                break;
            case CurrencyEnum.USD:
                const uahFromUsd = money * USD.sale;
                prices.push({
                    currency: CurrencyEnum.UAH,
                    amount: uahFromUsd,
                });
                prices.push({
                    currency: CurrencyEnum.USD,
                    amount: money,
                });
                prices.push({
                    currency: CurrencyEnum.EUR,
                    amount: uahFromUsd / EUR.sale,
                });
                break;
            case CurrencyEnum.EUR:
                const uahFromEur = money * EUR.sale;
                prices.push({
                    currency: CurrencyEnum.UAH,
                    amount: uahFromEur,
                });
                prices.push({
                    currency: CurrencyEnum.USD,
                    amount: uahFromEur / USD.sale,
                });
                prices.push({
                    currency: CurrencyEnum.EUR,
                    amount: money,
                });
                break;
            default:
                throw new ApiError(
                    HttpStatusEnum.BAD_REQUEST,
                    `Unsupported currency: ${currency}`,
                );
        }

        return prices;
    }
}

export const pricingService = new PricingService();
