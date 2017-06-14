import { parseString } from 'xml2js';
import fetch from 'node-fetch';
import { format as formatUrl } from 'url';

import type { Availability } from '../../type';

const buildUrl = (stationId: string) => ({
    protocol: 'http:',
    host: 'www.velib.paris',
    pathname: '/service/stationdetails/paris/' + stationId,
});

const parse = (id: string, res: string): Promise<Availability> =>
    new Promise((resolve, reject) =>
        parseString(res, (err, object) => {
            if (err || !object || !object.station)
                return reject(err || 'station object not found');

            const station = object.station;

            resolve({
                updated_date: +station.updated[0] * 1000,
                free_slot: +station.free[0],
                total_slot: +station.total[0],
                stationId: id,
            });
        })
    );

const overLimit = (err: any): boolean =>
    typeof err == 'string' && err.match(/request fails with 403 status/);

export const readStationAvailability = (
    options: {},
    stationId: string
): Promise<Availability> =>
    fetch(formatUrl(buildUrl(stationId)))
        .then(res => res.text())
        .then(res => parse(stationId, res))
        // format error
        .catch(err => Promise.reject(overLimit(err) ? 'overLimit' : err));
