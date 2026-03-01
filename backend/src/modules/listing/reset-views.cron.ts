import { CronJob } from "cron";

import { PeriodEnum } from "../location/enums/period.enum";
import { listingStaticService } from "./services/listing-static.service";

export const resetDayViewsCron = new CronJob("0 0 0 * * *", async () => {
    try {
        await listingStaticService.resetViews(PeriodEnum.DAY);
        console.info("Daily views reset successfully");
    } catch (error) {
        console.error("Failed to reset daily views:", error);
    }
});

export const resetWeekViewsCron = new CronJob("0 0 0 * * 0", async () => {
    try {
        await listingStaticService.resetViews(PeriodEnum.WEEK);
        console.info("Weekly views reset successfully");
    } catch (error) {
        console.error("Failed to reset weekly views:", error);
    }
});

export const resetMonthViewsCron = new CronJob("0 0 0 1 * *", async () => {
    try {
        await listingStaticService.resetViews(PeriodEnum.MONTH);
        console.info("Monthly views reset successfully");
    } catch (error) {
        console.error("Failed to reset monthly views:", error);
    }
});
