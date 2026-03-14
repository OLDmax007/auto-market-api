import { mainConfig } from "../configs/main.config";

export const buildLink = (path: string, token?: string): string => {
    const frontendUrl = mainConfig.FRONTEND_URL;
    if (!frontendUrl) throw new Error("FRONTEND_URL is not defined in .env");
    return token
        ? `${frontendUrl}${path}?token=${token}`
        : `${frontendUrl}${path}`;
};
