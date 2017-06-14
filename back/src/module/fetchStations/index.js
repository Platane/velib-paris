import { config } from '../../config';
import { create as createGOS } from '../../service/googleObjectStorage';
import { readStations } from '../../read/velibParisAPI/stations';
import { formatStation } from '../../service/googleObjectStorage/parse';
import { splitAndExec } from '../../util/batch/split';

const push = (gos, batch) =>
    gos.commit({
        mode: 'NON_TRANSACTIONAL',
        mutations: batch.map(item => ({ upsert: formatStation(item) })),
    });

const MAX_BATCH = 500;
const run = async () => {
    const gos = await createGOS(config.googleCloudPlatform);

    const stations = await readStations(config.JCDecauxAPI);

    console.log(`found ${stations.length} stations`);

    await splitAndExec(500, stations, stations =>
        gos.commit({
            mode: 'NON_TRANSACTIONAL',
            mutations: stations.map(station => ({
                upsert: formatStation(station),
            })),
        })
    );
};

run();
