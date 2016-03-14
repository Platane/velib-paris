export const buildAvailability = availability => ({
        key: {
            path: [
                { kind: 'station', name: 'station-'+availability.stationId },
                { kind: 'stationAvailability', name: availability.stationId+':'+(0|(availability.updated/1000)) },
            ],
        },

        properties: {
            total       : { integerValue    : availability.total, indexed: false },
            free        : { integerValue    : availability.free, indexed: false },
            updated     : { dateTimeValue   : new Date( availability.updated ).toISOString() },
        }
    })

export const buildStation = station => ({
        key: {
            path: [
                { kind: 'station', name: 'station-'+station.id },
            ],
        },

        properties: {
            name        : { stringValue     : station.name.split(' - ')[1], indexed: false },
            address     : { stringValue     : station.address, indexed: false },
            lat         : { doubleValue     : station.coordinates[0], indexed: false },
            lng         : { doubleValue     : station.coordinates[1], indexed: false },
        }
    })


export const parseStation = ({key, properties}) =>
    ({

        id          : key.path[0].name.split('-')[1],

        coordinates : [ +properties.lat.doubleValue, +properties.lng.doubleValue ],

        name        : properties.name.stringValue,

        address     : properties.name.stringValue,
    })

export const parseAvailability = ({key, properties}) =>
    ({


    })
