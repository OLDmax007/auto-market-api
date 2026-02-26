import { exchangeRatesAndPricesCron } from "./exchange-rates-and-prices.cron";
import { removeOldTokensCron } from "./remove-old-tokens.cron";
import {
    resetDayViewsCron,
    resetMonthViewsCron,
    resetWeekViewsCron,
} from "./reset-views.cron";

export const cronRunner = () => {
    exchangeRatesAndPricesCron.start();
    resetDayViewsCron.start();
    resetWeekViewsCron.start();
    resetMonthViewsCron.start();
    removeOldTokensCron.start();
};
