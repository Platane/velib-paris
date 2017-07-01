import { config } from '../../config';
import { readStations } from '../../read/velibParisAPI/stations';
import { promisify } from '../../util/promisify';
import connectDataStore from '@google-cloud/datastore';

export const run = async () => {
    const datastore = connectDataStore({
        projectId: config.googleCloudPlatform.project_id,
        credentials: config.googleCloudPlatform,
    });

    const stations = await readStations(config.JCDecauxAPI);

    console.log(`found ${stations.length} stations`);

    const save = promisify(datastore.save.bind(datastore));

    await save({
        key: datastore.key(['stationBatch', '_']),
        method: 'upsert',
        data: {
            stations,
        },
    });
};
