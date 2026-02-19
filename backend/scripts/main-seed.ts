import {dataBaseService} from "../src/services/database.service";
import {seedPermissionsAndRoles} from "./seed-permissions-and-roles";
import {seedLocations} from "./seed-locations";
import {pricingService} from "../src/services/pricing.service";
import {seedCars} from "./seed-cars";

const mainSeed = async () => {
    try {
        await dataBaseService.connectToDB();
        await pricingService.updateRates()
        await seedPermissionsAndRoles();
        await seedLocations();
        await seedCars()
        await dataBaseService.disconnectDB();
        console.log("DONE!!!");
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
