import profanity from "leo-profanity";

import { EnProfanityList } from "../constants/en-profanity-list";
import { RuProfanityList } from "../constants/ru-profanity-list";
import { UaProfanityList } from "../constants/ua-profanity-list";

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
}

export const profanityService = new ProfanityService();
