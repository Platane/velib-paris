export const formatAvailability = availability => ({
        key: {
            path: [
                { kind: 'station', name: 'station-'+availability.stationId },
                { kind: 'stationAvailability', name: availability.stationId+':'+(0|(availability.updated_date/1000)) },
            ],
        },

        properties: {
            total_slot  : { integerValue    : availability.total_slot,                      excludeFromIndexes: true },
            free_slot   : { integerValue    : availability.free_slot,                       excludeFromIndexes: true },
            updated_date: { timestampValue  : new Date( availability.updated_date ).toISOString() },
        }
    })

export const formatStation = station => ({
        key: {
            path: [
                { kind: 'station', name: 'station-'+station.id },
            ],
        },

        properties: {
            name        : { stringValue     : station.name.split('-')[1] || station.name,   excludeFromIndexes: true },
            address     : { stringValue     : station.address,                              excludeFromIndexes: true },
            coordinates : {
                geoPointValue   : {
                    latitude    : station.coordinates[0],
                    longitude   : station.coordinates[1],
                },
                excludeFromIndexes: true
            },
        }
    })


export const parseStation = ({ key, properties }) => ({

    id          : key.path[0].name.split('-')[1],

    coordinates : [ +properties.lat.doubleValue, +properties.lng.doubleValue ],

    // name        : properties.name.stringValue,

    // address     : properties.address.stringValue,
})

export const parseAvailability = ({key, properties}) =>
    ({


    })
