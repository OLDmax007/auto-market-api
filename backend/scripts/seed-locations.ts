import {LocationMap} from "../src/configs/location-map.config";
import {Location} from "../src/models/location.model";

export const seedLocations = async () => {
    try {
        await Location.deleteMany({});
        await Location.insertMany(LocationMap);
        console.log("Locations seeded successfully");
    } catch (err) {
        console.error("Error seeding locations:", err);
    }
};
