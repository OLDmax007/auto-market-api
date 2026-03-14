import {Location} from "../src/modules/location/location.model";
import {LocationMap} from "../src/modules/location/location.map";


export const seedLocations = async ():Promise<void> => {
    try {
        await Location.deleteMany({});
        await Location.insertMany(LocationMap);
        console.log("Locations seeded successfully");
    } catch (err) {
        console.error("Error seeding locations:", err);
    }
};
