// import { PlatformRoleEnum } from "./enums/platform-role.enum";
// import { ListingType } from "../types/listing.type";
// import { PlatformRoleType } from "./types/platform-role.type";
//
// class ListingPresenter {
//     // Базові поля для публічного перегляду (те, що бачать усі)
//     private getPublicFields(listing: ListingType) {
//         return {
//             _id: listing._id,
//             userId: listing.userId,
//             organizationId: listing.organizationId,
//             title: listing.title,
//             description: listing.description,
//             make: listing.make,
//             model: listing.model,
//             year: listing.year,
//             mileage_km: listing.mileage_km,
//             engineType: listing.engineType,
//             transmission: listing.transmission,
//             prices: listing.prices,
//             country: listing.country,
//             region: listing.region,
//             city: listing.city,
//             main_photo_url: listing.main_photo_url,
//             publishedAt: listing.publishedAt,
//         };
//     }
//
//     public toResponse(
//         listing: ListingType,
//         role: PlatformRoleType,
//     ): Partial<ListingType> {
//         const publicFields = this.getPublicFields(listing);
//
//         switch (role) {
//             case PlatformRoleEnum.ADMIN:
//             case PlatformRoleEnum.MANAGER:
//                 return {
//                     ...publicFields,
//                     isActive: listing.isActive,
//                     profanityCheckAttempts: listing.profanityCheckAttempts,
//                     createdAt: listing.createdAt,
//                     updatedAt: listing.updatedAt,
//                 };
//
//             default:
//                 return publicFields;
//         }
//     }
//
//     public toPrivateResponse(listing: ListingType): Partial<ListingType> {
//         return {
//             ...this.getPublicFields(listing),
//             isActive: listing.isActive,
//             profanityCheckAttempts: listing.profanityCheckAttempts,
//             createdAt: listing.createdAt,
//             updatedAt: listing.updatedAt,
//         };
//     }
// }
//
// export const listingPresenter = new ListingPresenter();
