import profanity from "leo-profanity";

import { EnProfanityList } from "../constants/en-profanity-list";
import { RuProfanityList } from "../constants/ru-profanity-list";
import { UaProfanityList } from "../constants/ua-profanity-list";
import { HttpStatusEnum } from "../enums/http-status.enum";
import { ApiError } from "../errors/api.error";

class ProfanityService {
    constructor() {
        profanity.loadDictionary("ru");
        profanity.loadDictionary("en");
        profanity.add([
            ...RuProfanityList,
            ...UaProfanityList,
            ...EnProfanityList,
        ]);
    }

    public hasProfanity(word: string): boolean {
        return profanity.check(word);
    }

    public hasAnyProfanity(...texts: string[]): boolean {
        return texts.some((text) => {
            if (!text) return false;
            const words = text.toLowerCase().split(/\s+/);

            return words.some((word) => this.hasProfanity(word));
        });
    }

    public checkProfanity(...texts: string[]): boolean {
        const isProfanity = this.hasAnyProfanity(...texts);

        if (isProfanity) {
            throw new ApiError(
                HttpStatusEnum.BAD_REQUEST,
                "Profanity detected. Please clean up your title or description",
            );
        }

        return isProfanity;
    }
}

export const profanityService = new ProfanityService();
