import { updateRatesCron } from "./update-rates.cron";

export const cronRunner = () => {
    updateRatesCron.start();
};
