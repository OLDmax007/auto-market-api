import { CronJob } from "cron";

import { pricingService } from "../services/pricing.service";

export const updateRatesCron = new CronJob("59 59 23 * * *", async () => {
    try {
        await pricingService.updateRates();
    } catch (error) {
        console.error("Failed to update rates:", error);
    }
});
