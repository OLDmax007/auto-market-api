import bcrypt from "bcrypt";

class PasswordService {
    hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }
}

export const passwordService = new PasswordService();
