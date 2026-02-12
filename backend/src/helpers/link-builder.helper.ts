export const buildLink = (path: string, token: string): string => {
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) throw new Error("FRONTEND_URL is not defined in .env");

    return `${frontendUrl}${path}?token=${token}`;
};
