export const buildAvailability = availability => ({
        key: {
            path: [
                { kind: 'station', name: 'station-'+availability.stationId },
                { kind: 'stationAvailability'}
            ],
        },

        properties: {
            n       : { integerValue    : availability.n, indexed: false },
            date    : { dateTimeValue   : new Date( availability.date ).toISOString() },
        }
    })

export const buildStation = station => ({
        key: {
            path: [
                { kind: 'station', name: 'station-'+station.id },
            ],
        },

        properties: {
            total       : { integerValue    : station.total, indexed: false },
            name        : { stringValue     : station.name },
            address     : { stringValue     : station.address },
            lat         : { doubleValue     : station.coordinates[0] },
            lng         : { doubleValue     : station.coordinates[1] },
        }
    })


export const parseStation = ({key, properties}) =>
    ({

        id          : key.path[0].name.split('-')[1],

        total       : +properties.total.integerValue,

        coordinates : [ +properties.lat.doubleValue, +properties.lng.doubleValue ],

        name        : properties.name.stringValue,

        address     : properties.name.stringValue,
    })

export const parseAvailability = ({key, properties}) =>
    ({


    })
