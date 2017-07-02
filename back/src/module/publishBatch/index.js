import { config } from '../../config';
import { readStations } from '../../read/velibParisAPI/stations';
import { promisify } from '../../util/promisify';
import connectDataStore from '@google-cloud/datastore';
import connectStorage from '@google-cloud/storage';
import type { Availability } from '../../type';

const getBatchInterval = (date: number) => {
    const day = 1000 * 60 * 60 * 24;

    const start_date = Math.floor(date / day) * day;
    const end_date = start_date + day - 1;

    return { start_date, end_date };
};

type Options = {
    date?: number,
};

const formatFileContent = (availabilities: Availability[]) => {
    const stationIds = {};
    availabilities.forEach(av =>
        (stationIds[av.stationId] = stationIds[av.stationId] || []).push([
            av.updated_date,
            av.free_slot,
            av.total_slot,
        ])
    );

    return Object.keys(stationIds).map(stationId => ({
        stationId,
        availabilities: stationIds[stationId],
    }));
};

export const run = async (options?: Options = {}) => {
    // set up google api
    const gConfig = {
        projectId: config.googleCloudPlatform.project_id,
        credentials: config.googleCloudPlatform,
    };

    const datastore = connectDataStore(gConfig);
    const storage = connectStorage(gConfig);

    const get = promisify(datastore.get.bind(datastore));

    // get the batch key
    const { start_date, end_date } = getBatchInterval(
        options.date || Date.now()
    );
    const batchKey = datastore.key([
        'availabilityBatch',
        new Date(start_date).toISOString().slice(0, 13),
    ]);

    // get all the availabilities for the batch
    // prettier-ignore
    const availabilities = (
        (await get(batchKey)) || { availabilities: [] }
    ).availabilities;

    // get or create
    const [bucket, _] = await storage.bucket('velib-forecast-data').get({
        autoCreate: true,
        regional: true,
        location: 'europe-west1',
        nearline: true,
    });

    // create the file
    const file = bucket.file(
        `${new Date(start_date).toISOString().slice(0, 13)}.json`
    );

    await file.save(JSON.stringify(formatFileContent(availabilities)), {
        gzip: true,
        public: true,
    });
};
