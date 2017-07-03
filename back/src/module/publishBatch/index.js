import { config } from '../../config';
import { readStations } from '../../read/velibParisAPI/stations';
import { promisify } from '../../util/promisify';
import connectDataStore from '@google-cloud/datastore';
import connectStorage from '@google-cloud/storage';
import type { Availability } from '../../type';

const getInterval = (date: number) => {
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

const getAvailabilities = async (
    datastore,
    start_date: number,
    end_date: number
): Promise<Availability[]> => {
    const query = datastore
        .createQuery('availabilityBatch')
        .filter('start_date', '>=', start_date)
        .filter('start_date', '<', end_date)
        .order('start_date');

    const [batches, _] = await datastore.runQuery(query);

    return []
        .concat(...batches.map(({ availabilities }) => availabilities))
        .filter(x => start_date <= x.updated_date && x.updated_date < end_date);
};

export const run = async (options?: Options = {}) => {
    // set up google api
    const gConfig = {
        projectId: config.googleCloudPlatform.project_id,
        credentials: config.googleCloudPlatform,
    };

    const datastore = connectDataStore(gConfig);
    const storage = connectStorage(gConfig);

    // get or create the bucket
    const [bucket, _] = await storage.bucket('velib-forecast-data').get({
        autoCreate: true,
        regional: true,
        location: 'europe-west1',
        nearline: true,
    });

    const { start_date, end_date } = getInterval(options.date || Date.now());

    // get the batch key
    const availabilities = await getAvailabilities(
        datastore,
        start_date,
        end_date
    );

    // create the file
    const file = bucket.file(
        `${new Date(start_date).toISOString().slice(0, 13)}.json`
    );

    const fileContent = JSON.stringify(formatFileContent(availabilities));

    await file.save(fileContent, {
        gzip: true,
        public: true,
    });
};
