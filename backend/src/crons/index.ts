import {
    resetDayViewsCron,
    resetMonthViewsCron,
    resetWeekViewsCron,
} from "./reset-views.cron";
import { updateRatesCron } from "./update-rates.cron";

export const cronRunner = () => {
    updateRatesCron.start();
    resetDayViewsCron.start();
    resetWeekViewsCron.start();
    resetMonthViewsCron.start();
};
