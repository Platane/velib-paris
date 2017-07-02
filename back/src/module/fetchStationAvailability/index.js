import { config } from '../../config';
import { readStationAvailability as fetch_JCDecauxAPI } from '../../read/JCDecauxAPI/availability';
import { readStationAvailability as fetch_velibParisAPI } from '../../read/velibParisAPI/availability';
import { createFetcher } from '../../util/batch/chainFetcher';
import { promisify } from '../../util/promisify';
import connectDataStore from '@google-cloud/datastore';

// merge all the availability fetcher
const fetch = createFetcher([
    // one for the velib paris page
    (stationId: string) => fetch_velibParisAPI({}, stationId),

    // one for each api key
    ...config.JCDecauxAPI.apiKeys.map(apiKey => (stationId: string) =>
        fetch_JCDecauxAPI({ apiKey }, stationId)
    ),
]);

const getBatchInterval = (date: number) => {
    const day = 1000 * 60 * 60 * 24;

    const start_date = Math.floor(date / day) * day;
    const end_date = start_date + day - 1;

    return { start_date, end_date };
};

// sort the station from the last recently updated to the most recently ones
// assuming the previousAvailabilities is sorted by updated_date ascending
const getStationsToFetch = (
    stations,
    previousAvailabilities
): { id: string, updated_date: number }[] => {
    const toFetch = [];

    const list = previousAvailabilities.slice(-2000);

    for (let i = previousAvailabilities.length; i--; ) {
        const { updated_date, stationId: id } = previousAvailabilities[i];

        if (!toFetch.includes(id)) toFetch.push({ id, updated_date });
    }

    for (let i = stations.length; i--; ) {
        const id = stations[i].id;

        if (!toFetch.includes(id)) toFetch.push({ id, updated_date: 0 });
    }

    return toFetch;
};

export const run = async () => {
    const datastore = connectDataStore({
        projectId: config.googleCloudPlatform.project_id,
        credentials: config.googleCloudPlatform,
    });

    const save = promisify(datastore.save.bind(datastore));
    const get = promisify(datastore.get.bind(datastore));

    // read stations from datastore
    const { stations } = (await get(datastore.key(['stationBatch', '_']))) || {
        stations: [],
    };

    // retrive batch
    const { start_date, end_date } = getBatchInterval(Date.now());
    const batchKey = datastore.key([
        'availabilityBatch',
        new Date(start_date).toISOString().slice(0, 13),
    ]);
    const batch = await get(batchKey);

    // previous availability
    const previousAvailabilities = batch ? batch.availabilities : [];

    // sort station, in order too fetch the most out of date ones
    const stationsToFetch = getStationsToFetch(
        stations,
        previousAvailabilities
    );

    // fetch the new availabilities
    const availabilities = await fetch(stationsToFetch.map(({ id }) => id));

    // only keeps the new ones
    const newAvailabilities = availabilities.filter(x => {
        const { updated_date } =
            stationsToFetch.find(({ id }) => id === x.id) || {};

        return x.updated_date > updated_date;
    });

    console.log(
        `found ${availabilities.length} availabilities ( ${newAvailabilities.length} fresh ) ( from the ${stations.length} stations )`
    );

    await save({
        key: batchKey,
        method: 'upsert',
        data: {
            start_date,
            end_date,
            availabilities: [...previousAvailabilities, ...newAvailabilities],
        },
    });
};
