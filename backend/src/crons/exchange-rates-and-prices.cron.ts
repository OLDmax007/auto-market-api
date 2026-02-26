import { CronJob } from "cron";

import { Listing } from "../models/listing/listing.model";
import { pricingService } from "../services/pricing.service";

export const exchangeRatesAndPricesCron = new CronJob(
    "0 0 * * * *",
    async () => {
        try {
            await pricingService.updateRates();
            const cursor = Listing.find({ isActive: true });

            for await (const listing of cursor) {
                await pricingService.refreshAllListingsPrices(listing);
            }
            console.log("Update Successfully");
        } catch (error) {
            console.error("Failed to update rates and prices:", error);
        }
    },
);
