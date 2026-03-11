export const REGEX_CONSTANTS = {
    CAR: {
        MODEL: /^[a-zA-Z0-9]+(?:[ -][a-zA-Z0-9]+)*$/,
    },
    LISTING: {
        TITLE: /^[a-zA-Zа-яА-ЯіІїЇєЄ0-9 \-!?.,()"':/]+$/,
        DESCRIPTION: /^(?!.*\b(?:https?:\/\/|www\.))/i,
    },
    USER: {
        NAME: /^[A-ZА-ЯІЇЄ][a-zа-яіїє']+(?:[-'][A-ZА-ЯІЇЄ][a-zа-яіїє']+)*$/,
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        EMAIL: /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/,
    },
};
