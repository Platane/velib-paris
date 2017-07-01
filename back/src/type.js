export type Coordinates = [
    // latitude
    number,
    // longitude
    number,
];

export type Station = {
    id: string,
    name: string,
    address: string,
    coordinates: Coordinates,
    updated_date?: number,
};

export type Availability = {
    stationId: string,
    updated_date: number,
    free_slot: number,
    total_slot: number,
};

export type GoogleStorageObject = {
    key: {
        path: Array<{ kind: string, name: string }>,
    },
    properties: {
        [string]: Object,
    },
};
