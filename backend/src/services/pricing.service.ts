import { CurrencyEnum } from "../enums/currency.enum";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";
import { listingRepository } from "../repositories/listing.repository";
import { rateRepository } from "../repositories/rate.repository";
import { ListingType } from "../types/listing.type";
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

        if (!rate?.sale) {
            throw new Error(`Rate for ${currency} not found`);
        }

        const result = money * Number(rate.sale);

        return Number(result.toFixed(2));
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
                    mainCurrency: true,
                    currency: CurrencyEnum.UAH,
                    amount: Math.round(money),
                });
                prices.push({
                    currency: CurrencyEnum.USD,
                    amount: Math.round(money / USD.sale),
                    rate: USD.sale,
                });
                prices.push({
                    currency: CurrencyEnum.EUR,
                    amount: Math.round(money / EUR.sale),
                    rate: EUR.sale,
                });
                break;
            case CurrencyEnum.USD:
                const uahFromUsd = money * USD.sale;
                prices.push({
                    currency: CurrencyEnum.UAH,
                    amount: Math.round(uahFromUsd),
                });
                prices.push({
                    mainCurrency: true,
                    currency: CurrencyEnum.USD,
                    amount: Math.round(money),
                    rate: USD.sale,
                });
                prices.push({
                    currency: CurrencyEnum.EUR,
                    amount: Math.round(uahFromUsd / EUR.sale),
                    rate: EUR.sale,
                });
                break;
            case CurrencyEnum.EUR:
                const uahFromEur = money * EUR.sale;
                prices.push({
                    currency: CurrencyEnum.UAH,
                    amount: Math.round(uahFromEur),
                });
                prices.push({
                    currency: CurrencyEnum.USD,
                    amount: Math.round(uahFromEur / USD.sale),
                    rate: USD.sale,
                });
                prices.push({
                    mainCurrency: true,
                    currency: CurrencyEnum.EUR,
                    amount: Math.round(money),
                    rate: EUR.sale,
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

    public async getCalculatedPrices(
        enteredPrice: CurrencyAmountType,
    ): Promise<CurrencyAmountType[]> {
        return pricingService.calculateListingPrices(
            enteredPrice.amount,
            enteredPrice.currency,
        );
    }

    public async refreshAllListingsPrices(listing: ListingType): Promise<void> {
        const originalPrice = listing.prices.find((p) => p.mainCurrency);
        const resultPrices = await this.getCalculatedPrices({
            ...originalPrice,
        });

        await listingRepository.updateById(listing._id, {
            prices: resultPrices,
        });
    }
}
export const pricingService = new PricingService();
