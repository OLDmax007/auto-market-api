import {dataBaseService} from "../src/services/database.service";
import {seedPermissionsAndRoles} from "./seed-permissions-and-roles";
import {seedLocations} from "./seed-locations";

const mainSeed = async () => {
    try {
        await dataBaseService.connectToDB();
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
