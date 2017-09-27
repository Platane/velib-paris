import fetch from 'node-fetch'
import { format as formatUrl } from 'url'

import type { Availability } from '../../type'

const buildUrl = (apiKey, stationId) => ({
    protocol: 'https:',
    host: 'api.jcdecaux.com',
    pathname: 'vls/v1/stations/' + stationId,
    query: { apiKey, contract: 'Paris' }
})

const parse = (id: string, res: Object): Availability => ({
    updated_date: +res.last_update,
    free_slot: +res.available_bike_stands,
    total_slot: +res.bike_stands,
    stationId: id
})

const overLimit = (err: any): boolean => false

type Options = {
    apiKey: string
}

export const readStationAvailability = (
    options: Options,
    stationId: string
): Promise<Availability> =>
    fetch(formatUrl(buildUrl(options.apiKey, stationId)))
        .then(res => res.json())
        // format error
        .catch(err => Promise.reject(overLimit(err) ? 'overLimit' : err))
        .then(res => parse(stationId, res))
