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
