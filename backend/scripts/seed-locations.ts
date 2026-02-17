import {Location} from "../src/models/location.model";
import {LocationMap} from "../src/mappers/location.map";

export const seedLocations = async () => {
    try {
        await Location.deleteMany({});
        await Location.insertMany(LocationMap);
        console.log("Locations seeded successfully");
    } catch (err) {
        console.error("Error seeding locations:", err);
    }
};
