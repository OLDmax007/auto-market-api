import {Car} from "../src/modules/car/car.model";
import {CarMap} from "../src/modules/car/car.map";


export const seedCars = async ():Promise<void> => {
    try {
        await Car.deleteMany({});
        const carsToInsert = Object.entries(CarMap).map(([make, models]) => ({
            make,
            models
        }));
        await Car.insertMany(carsToInsert);
        console.log("Cars seeded successfully");
    } catch (err) {
        console.error("Error seeding cars:", err);
    }
};
