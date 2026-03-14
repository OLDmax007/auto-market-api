import {seedLocations} from "./seed-locations";
import {seedCars} from "./seed-cars";
import {pricingService} from "../src/modules/listing/services/pricing.service";
import {dataBaseService} from "../src/common/services/database.service";
import {seedAdmin} from "./seed-admin";
import {seedPermissionsAndRoles} from "./seed-permissions-and-roles";

const mainSeed = async ():Promise<void> => {
    try {
        await dataBaseService.connectToDB();
        await pricingService.updateRates()
        await seedPermissionsAndRoles();
        await seedLocations();
        await seedCars()
        await seedAdmin()
        await dataBaseService.disconnectDB();
        console.log("Main seed successfully DONE!");
    } catch (err) {
        console.error("\nSEEDING FAILED");
        if (err.response) {
            console.error(`API Error: ${err.config.method.toUpperCase()} ${err.config.url}`);
            console.error(`Status: ${err.response.status}`);
            console.error(`Message:`, err.response.data);
        } else if (err.request) {
            console.error("No response from server. Check your internet connection.");
        } else {
            console.error(`System Error: ${err.message}`);
        }

        console.error("\nStack Trace:");
        console.error(err.stack?.split('\n').slice(0, 3).join('\n'));
        process.exit(1);
    }
};

void mainSeed();
