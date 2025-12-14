import { userRepository } from "../repositories/user.repository";
import { UserType } from "../types/user.type";

class UserService {
    public getAll(): Promise<UserType[]> {
        return userRepository.getAll();
    }

    public getById(id: string): Promise<UserType> {
        return userRepository.getById(id);
    }
}

export const userService = new UserService();
