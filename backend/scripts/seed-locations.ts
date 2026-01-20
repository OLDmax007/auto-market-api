import {LocationModel} from "../src/models/location.model";
import {LocationMap} from "../src/configs/location-map.config";

export const seedLocations = async () => {
    try {
        await LocationModel.deleteMany({});
        await LocationModel.insertMany(LocationMap);
        console.log("Locations seeded successfully");
    } catch (err) {
        console.error("Error seeding locations:", err);
    }
};
