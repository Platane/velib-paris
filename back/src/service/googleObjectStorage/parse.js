import type { Station, Availability } from '../../type';

type GoogleStorageObject = {
    key: {
        path: Array<{ kind: string, name: string }>,
    },
    properties: {
        [string]: Object,
    },
};

export const formatAvailability = (
    availability: Availability
): GoogleStorageObject => ({
    key: {
        path: [
            { kind: 'station', name: 'station-' + availability.stationId },
            {
                kind: 'stationAvailability',
                name:
                    availability.stationId +
                        ':' +
                        (0 | (availability.updated_date / 1000)),
            },
        ],
    },

    properties: {
        total_slot: {
            integerValue: availability.total_slot,
            excludeFromIndexes: true,
        },
        free_slot: {
            integerValue: availability.free_slot,
            excludeFromIndexes: true,
        },
        updated_date: {
            timestampValue: new Date(availability.updated_date).toISOString(),
        },
    },
});

export const formatStation = (station: Station): GoogleStorageObject => ({
    key: {
        path: [{ kind: 'station', name: 'station-' + station.id }],
    },

    properties: {
        name: {
            stringValue: station.name.split('-')[1] || station.name,
            excludeFromIndexes: true,
        },
        address: { stringValue: station.address, excludeFromIndexes: true },
        coordinates: {
            geoPointValue: {
                latitude: station.coordinates[0],
                longitude: station.coordinates[1],
            },
            excludeFromIndexes: true,
        },
        updated_date: {
            timestampValue: new Date(
                station.updated_date || Date.now()
            ).toISOString(),
        },
    },
});

export const parseStation = ({
    key,
    properties,
}: GoogleStorageObject): Station => ({
    id: key.path[0].name.split('-')[1],

    coordinates: [
        +properties.coordinates.geoPointValue.latitude,
        +properties.coordinates.geoPointValue.longitude,
    ],

    name: properties.name.stringValue,

    address: properties.address.stringValue,
});

export const parseAvailability = ({
    key,
    properties,
}: GoogleStorageObject): Availability => ({
    stationId: key.path[0].name.split('-')[1],

    total_slot: properties.total_slot.integerValue,

    free_slot: properties.free_slot.integerValue,

    updated_date: properties.updated_date.timestampValue,
});
