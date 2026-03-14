import bcrypt from "bcrypt";

class PasswordService {
    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    public async comparePassword(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

export const passwordService = new PasswordService();
