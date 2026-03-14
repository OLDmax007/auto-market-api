import { Rate } from "./rate.model";
import { PrivatBankRateType } from "./rate.type";

class RateRepository {
    public async getAll(): Promise<PrivatBankRateType[]> {
        return Rate.find();
    }

    public async upsertRates(rates: PrivatBankRateType[]): Promise<void> {
        const operations = rates.map(({ ccy, base_ccy, buy, sale }) => ({
            updateOne: {
                filter: {
                    ccy,
                    base_ccy,
                },
                update: {
                    $set: {
                        ccy,
                        base_ccy,
                        buy,
                        sale,
                    },
                },
                upsert: true,
            },
        }));

        await Rate.bulkWrite(operations);
    }
}

export const rateRepository = new RateRepository();
