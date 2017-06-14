import { parseString } from 'xml2js';
import fetch from 'node-fetch';
import { format as formatUrl } from 'url';

import type { Station } from '../../type';

const buildUrl = () => ({
    protocol: 'http:',
    host: 'www.velib.paris',
    pathname: '/service/carto',
});

const parse = (res: string): Promise<Station[]> =>
    new Promise((resolve, reject) =>
        parseString(res, (err, object) => {
            if (err || !object || !object.carto || !object.carto.markers)
                return reject(err || 'markers array not found');

            const stations = object.carto.markers[0].marker.map(x => ({
                id: x.$.number,
                address: x.$.fullAddress,
                name: x.$.name,
                coordinates: [+x.$.lat, +x.$.lng],
            }));

            resolve(stations);
        })
    );

const overLimit = (err: any): boolean =>
    typeof err == 'string' && err.match(/request fails with 403 status/);

export const readStations = (options: {}): Promise<Station[]> =>
    fetch(formatUrl(buildUrl()))
        .then(res => res.text())
        // format error
        .catch(err => Promise.reject(overLimit(err) ? 'overLimit' : err))
        .then(res => parse(res));
