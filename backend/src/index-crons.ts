import { removeOldTokensCron } from "./modules/auth/remove-old-tokens.cron";
import {
    resetDayViewsCron,
    resetMonthViewsCron,
    resetWeekViewsCron,
} from "./modules/listing/reset-views.cron";
import { exchangeRatesAndPricesCron } from "./modules/rate/exchange-rates-and-prices.cron";

export const cronRunner = () => {
    exchangeRatesAndPricesCron.start();
    resetDayViewsCron.start();
    resetWeekViewsCron.start();
    resetMonthViewsCron.start();
    removeOldTokensCron.start();
};
