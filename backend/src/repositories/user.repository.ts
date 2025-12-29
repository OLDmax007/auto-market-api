import { User } from "../models/user.model";
import { UserCreateDbType, UserType } from "../types/user.type";

class UserRepository {
    public getAll(): Promise<UserType[]> {
        return User.find();
    }

    public getById(id: string): Promise<UserType> {
        return User.findById(id);
    }

    public getByEmail(email: string): Promise<UserType> {
        return User.findOne({ email });
    }

    public create(dto: UserCreateDbType): Promise<UserType> {
        return User.create(dto);
    }

    public updateById(id: string, platformRoleId: string): Promise<UserType> {
        return User.findByIdAndUpdate(
            id,
            {
                platformRoleId,
            },
            { new: true },
        );
    }
}

export const userRepository = new UserRepository();
