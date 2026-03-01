// import { PlatformRoleEnum } from "./enums/platform-role.enum";
// import { UserType } from "./types/user.type";
//
// class UserPresenter {
//
//     private getBaseFields(user: UserType) {
//         return {
//             _id: user._id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             age: user.age,
//             email: user.email,
//             organizationId: user.organizationId,
//             platformRoleId: user.platformRoleId,
//             avatar: user.avatar,
//         };
//     }
//
//     public toPublicResponse(
//         user: UserType,
//         role: PlatformRoleEnum,
//     ): Partial<UserType> {
//         const baseFields = this.getBaseFields(user);
//
//         switch (role) {
//             case PlatformRoleEnum.ADMIN:
//             case PlatformRoleEnum.MANAGER:
//                 return {
//                     ...baseFields,
//                     isActive: user.isActive,
//                     isVerified: user.isVerified,
//                     balance: user.balance,
//                     subscriptionId: user.subscriptionId,
//                     createdAt: user.createdAt,
//                     updatedAt: user.updatedAt,
//                 };
//
//             default:
//                 return baseFields;
//         }
//     }
//
//     public toPrivateResponse(user: UserType): Partial<UserType> {
//         const baseFields = this.getBaseFields(user);
//
//         return {
//             ...baseFields,
//             subscriptionId: user.subscriptionId,
//             balance: user.balance,
//             isActive: user.isActive,
//             isVerified: user.isVerified,
//             createdAt: user.createdAt,
//         };
//     }
// }
//
// export const userPresenter = new UserPresenter();
