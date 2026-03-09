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
        return User.paginate({ ...filter, isDeleted: false }, options);
    }

    public getById(id: string): Promise<UserType> {
        return User.findOne({ _id: id, isDeleted: false });
    }

    public getByEmail(email: string): Promise<UserType> {
        return User.findOne({ email, isDeleted: false });
    }

    public create(dto: UserCreateDbType): Promise<UserType> {
        return User.create(dto);
    }

    public updateById(
        id: string,
        dto: UpdateEntityType<UserType>,
    ): Promise<UserType> {
        return User.findOneAndUpdate({ _id: id, isDeleted: false }, dto, {
            new: true,
        });
    }

    public async deleteById(id: string): Promise<UserType | null> {
        return User.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                isActive: false,
                deletedAt: new Date(),
            },
            { new: true },
        );
    }
}

export const userRepository = new UserRepository();
