import { User } from "../models/user.model";
import { UserCreateDbType, UserType } from "../types/user.type";

class UserRepository {
    public getAll(): Promise<UserType[]> {
        return User.find();
    }

    public getById(id: string): Promise<UserType> {
        return User.findById(id);
    }

    public create(dto: UserCreateDbType): Promise<UserType> {
        return User.create(dto);
    }
}

export const userRepository = new UserRepository();
