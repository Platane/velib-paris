import { config } from '../../config';
import { readStationAvailability as fetch_JCDecauxAPI } from '../../read/JCDecauxAPI/availability';
import { readStationAvailability as fetch_velibParisAPI } from '../../read/velibParisAPI/availability';
import { createFetcher } from '../../util/batch/chainFetcher';
import { promisify } from '../../util/promisify';
import connectDataStore from '@google-cloud/datastore';

import type { Availability } from '../../type';

// merge all the availability fetcher
const fetch = createFetcher([
    // one for the velib paris page
    (stationId: string) => fetch_velibParisAPI({}, stationId),

    // one for each api key
    ...config.JCDecauxAPI.apiKeys.map(apiKey => (stationId: string) =>
        fetch_JCDecauxAPI({ apiKey }, stationId)
    ),
]);

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

        if (!toFetch.some(x => x.id === id)) toFetch.push({ id, updated_date });
    }

    for (let i = stations.length; i--; ) {
        const id = stations[i].id;

        if (!toFetch.some(x => x.id === id))
            toFetch.unshift({ id, updated_date: 0 });
    }

    return toFetch;
};

// return the X last availabilities fetched ( from the db )
// ordered by most recent first
const getLastFetchedAvialabilities = async (
    datastore
): Promise<Availability[]> => {
    const query = datastore
        .createQuery('availabilityBatch')
        .order('start_date', { descending: true })
        .limit(5);

    const [batches, _] = await datastore.runQuery(query);

    return []
        .concat(
            ...batches.reverse().map(({ availabilities }) => availabilities)
        )
        .sort((a, b) => (a.updated_date < b.updated_date ? 1 : -1));
};

const getLimit = (availabilities: Availability[]) => {
    let start_date = Infinity;
    let end_date = -Infinity;

    availabilities.forEach(({ updated_date }) => {
        start_date = Math.min(updated_date, start_date);
        end_date = Math.max(updated_date, end_date);
    });

    return { start_date, end_date };
};

const getBatchStat = (availabilities: Availability[]) => {
    const { start_date, end_date } = getLimit(availabilities);
    const l = end_date - start_date + 1;

    const partitions = Array.from({ length: 10 }).map((_, i, arr) => {
        const a = start_date + i / arr.length * l;
        const b = start_date + (i + 1) / arr.length * l;

        return availabilities.filter(
            x => a <= x.updated_date && x.updated_date < b
        ).length;
    });

    return [
        `end date : ${new Date(end_date)
            .toISOString()
            .slice(0, 19)} ( ${Math.round(l / (1000 * 60) * 10) / 10} min )`,
        `repartition: ${availabilities.length} [${partitions.join(',')}]`,
    ].join('\n');
};

// remove availabilities that are too old to be fresh
// or already in the previous batches
const cleanAvailabilities = (
    availabilities: Availability[],
    stationsToFetch: Array<{ id: string, updated_date: number }>
) => {
    // 20 min
    const MAX_WINDOW = 20 * 60 * 1000;

    const { start_date, end_date } = getLimit(availabilities);
    const window = Math.min(MAX_WINDOW, end_date - start_date);

    return availabilities.filter(x => {
        // older than 20 min ( relatively to the most recent one )
        if (x.updated_date < end_date - window) return false;

        // check if it's older ( or equals ) than the last one
        const previous = stationsToFetch.find(({ id }) => id === x.stationId);

        return !previous || x.updated_date > previous.updated_date;
    });
};

type Options = {
    max_stations?: number,
};

export const run = async (options?: Options = {}) => {
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

    // previous availability
    const previousAvailabilities = await getLastFetchedAvialabilities(
        datastore
    );

    // sort station, in order too fetch the most out of date ones
    // only keep the firsts ones if the options 'max_stations' is set
    const stationsToFetch = getStationsToFetch(
        stations,
        previousAvailabilities
    ).slice(0, options.max_stations || Infinity);

    // fetch the new availabilities
    const availabilities = await fetch(stationsToFetch.map(({ id }) => id));

    // only keeps the new ones
    const newAvailabilities = cleanAvailabilities(
        availabilities,
        stationsToFetch
    );

    console.log(
        `found ${availabilities.length} availabilities ( ${newAvailabilities.length} fresh ) from the ${stations.length} stations ( ${stationsToFetch.length} to fetch )`
    );

    if (newAvailabilities.length === 0) return;

    const { start_date, end_date } = getLimit(newAvailabilities);
    const batchKey = datastore.key('availabilityBatch');

    const d = await save({
        key: batchKey,
        method: 'upsert',
        data: [
            {
                name: 'start_date',
                value: start_date,
            },
            {
                name: 'end_date',
                value: end_date,
            },
            {
                name: 'availabilities',
                value: newAvailabilities,
                excludeFromIndexes: true,
            },
        ],
    });

    console.log(`key: ${batchKey.id}  \n${getBatchStat(newAvailabilities)}`);
};
