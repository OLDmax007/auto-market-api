import profanity from "leo-profanity";

import { EN_PROFANITY_LIST } from "../constants/en-profanity-list.constants";
import { RU_PROFANITY_LIST } from "../constants/ru-profanity-list.constants";
import { UA_PROFANITY_LIST } from "../constants/ua-profanity-list.constants";

class ProfanityService {
    constructor() {
        profanity.loadDictionary("ru");
        profanity.loadDictionary("en");
        profanity.add([
            ...RU_PROFANITY_LIST,
            ...UA_PROFANITY_LIST,
            ...EN_PROFANITY_LIST,
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
}

export const profanityService = new ProfanityService();
