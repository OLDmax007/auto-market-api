import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { rateRepository } from "../repositories/rate.repository";
import { CurrencyAmountType } from "../types/rate.type";
import { privatBankService } from "./privatbank.service";

class PricingService {
    public async updateRates(): Promise<void> {
        const rates = await privatBankService.getRates();
        await rateRepository.upsertRates(rates);
    }

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
        const rates = await privatBankService.getRatesFormatted();

        if (!rates.USD || !rates.EUR) {
            throw new ApiError(
                HttpStatusEnum.SERVICE_UNAVAILABLE,
                "Currency rates not available",
            );
        }

        const prices: CurrencyAmountType[] = [];
        const { USD, EUR } = rates;

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
