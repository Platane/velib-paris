import { config } from '../../config';
import { create as createGOS } from '../../service/googleObjectStorage';
import { readStationAvailability as r1 } from '../../read/JCDecauxAPI/availability';
import { readStationAvailability as r2 } from '../../read/velibParisAPI/availability';
// import { readStations } from '../../read/velibParisAPI/stations';
import { readStations } from '../../read/googleObjectStorage/stations';
import { splitAndExec } from '../../util/batch/split';
import { createFetcher } from '../../util/batch/chainFetcher';
import {
    formatAvailability,
    formatStation,
} from '../../service/googleObjectStorage/parse';

const fetch = createFetcher([
    r1.bind(null, config.JCDecauxAPI),
    r2.bind(null, config.JCDecauxAPI),
]);

const run = async () => {
    const gos = await createGOS(config.googleCloudPlatform);

    const stations = await readStations(gos);

    const availabilities = await fetch(stations.map(({ id }) => id));

    console.log(
        `found ${availabilities.length} availabilities ( from the ${stations.length} stations )`
    );

    await splitAndExec(500, availabilities, availabilities =>
        gos.commit({
            mode: 'NON_TRANSACTIONAL',
            mutations: availabilities.map(availability => ({
                upsert: formatAvailability(availability),
            })),
        })
    );

    const now = Date.now();

    const newStations = availabilities.map(({ stationId }) => {
        const station = stations.find(({ id }) => id === stationId);
        return { ...station, updated_date: now };
    });

    await splitAndExec(500, newStations, stations =>
        gos.commit({
            mode: 'NON_TRANSACTIONAL',
            mutations: stations.map(station => ({
                upsert: formatStation(station),
            })),
        })
    );
};

run();
