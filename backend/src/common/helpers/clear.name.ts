import _ from "lodash";

export const clearName = (value: string): string => {
    return _.capitalize(value.trim());
};
