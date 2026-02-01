import { User } from "../models/user.model";
import { UserCreateDbType, UserType } from "../types/user.type";

class UserRepository {
    public getAll(): Promise<UserType[]> {
        return User.find();
    }

    public getManyByPlatformId(platformRoleId: string): Promise<UserType[]> {
        return User.find({ platformRoleId });
    }
    s;

    public getById(id: string): Promise<UserType> {
        return User.findById(id);
    }

    public getByEmail(email: string): Promise<UserType> {
        return User.findOne({ email });
    }

    public create(dto: UserCreateDbType): Promise<UserType> {
        return User.create(dto);
    }

    public updateById(id: string, data: Partial<UserType>): Promise<UserType> {
        return User.findByIdAndUpdate(id, data, { new: true });
    }
}

export const userRepository = new UserRepository();
