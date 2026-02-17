import { CronJob } from "cron";

import { mainConfig } from "../configs/main.config";
import { timeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

export const removeOldTokensCron = new CronJob("0 0 0 1 * *", async () => {
    try {
        const timeLife = mainConfig.JWT_REFRESH_LIFETIME;
        const { value, unit } = timeHelper.parseLifeTime(timeLife);
        const date = timeHelper.subFromCurrentTime(value, unit);
        const count = await tokenRepository.deleteBeforeDate(date);

        if (count) console.log(`deleted - ${count}`);
        else console.log(`delete no one`);
    } catch (e) {
        console.error(e.message);
    }
});
