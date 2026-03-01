import dayjs, { ManipulateType } from "dayjs";

import { timeUnitsMap } from "../mappers/time-units.map";

class TimeHelper {
    public parseLifeTime(str: string): { value: number; unit: ManipulateType } {
        const match = str.trim().match(/^(\d+)\s*([a-zA-Z]+)$/);

        if (!match) {
            throw new Error(
                `Invalid lifetime format: "${str}". Please use format like "30m", "1d" or "7 days"`,
            );
        }

        const value = parseInt(match[1], 10);
        let unitRaw = match[2].toLowerCase();

        const unit = timeUnitsMap[unitRaw];

        if (!unit) {
            throw new Error(`Unsupported unit: "${unitRaw}"`);
        }
        return { value, unit };
    }

    public subFromCurrentTime(value: number, unit: ManipulateType): Date {
        return dayjs().subtract(value, unit).toDate();
    }
}

export const timeHelper = new TimeHelper();
