export const REGEX_CONSTANTS = {
    CAR: {
        MODEL: /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
    },
    LISTING: {
        TITLE: /^[a-zA-Zа-яА-Я0-9\s\-\!\?\.\(\)\,]+$/,
        DESCRIPTION: /^(?!.*(http|https|www)).*$/i,
    },
    USER: {
        NAME: /^[A-ZА-ЯЁІЇЄ][a-zа-яёіїє']+(?:[-][A-ZА-ЯЁІЇЄ][a-zа-яёіїє']+)*$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    },
};
