import {dataBaseService} from "../src/services/database.service";
import {seedPermissionsAndRoles} from "./seed-permissions-and-roles";
import {seedLocations} from "./seed-locations";
import {pricingService} from "../src/services/pricing.service";

const mainSeed = async () => {
    try {
        await dataBaseService.connectToDB();
        await pricingService.updateRates()
        await seedPermissionsAndRoles();
        await seedLocations();
        await dataBaseService.disconnectDB();
        console.log("DONE!!!");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

mainSeed();
