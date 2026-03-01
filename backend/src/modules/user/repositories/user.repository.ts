import { UpdateEntityType } from "../../../common/types/base.type";
import {
    PaginatedResponseType,
    PaginateFilterType,
    PaginateOptionsType,
} from "../../../common/types/pagination.type";
import { User } from "../models/user.model";
import { UserCreateDbType, UserType } from "../types/user.type";

class UserRepository {
    public getAllPaginated(
        filter: PaginateFilterType,
        options: PaginateOptionsType,
    ): Promise<PaginatedResponseType<UserType>> {
        return User.paginate(filter, options);
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

    public updateById(
        id: string,
        dto: UpdateEntityType<UserType>,
    ): Promise<UserType> {
        return User.findByIdAndUpdate(id, dto, { new: true });
    }

    public deleteById(id: string): Promise<UserType> {
        return User.findByIdAndDelete(id);
    }
}

export const userRepository = new UserRepository();
