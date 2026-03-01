import {Car} from "../src/modules/car/car.model";
import {CarMap} from "../src/modules/car/car.map";


export const seedCars = async () => {
    try {
        await Car.deleteMany({});
        await Car.insertMany(CarMap);
        console.log("Cars seeded successfully");
    } catch (err) {
        console.error("Error seeding cars:", err);
    }
};
