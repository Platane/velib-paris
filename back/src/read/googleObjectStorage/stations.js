import { parseStation } from '../../service/googleObjectStorage/parse';

export const readStations = gos =>
    gos
        .runQuery({
            query: {
                kind: [{ name: 'station' }],
                order: {
                    property: {
                        name: 'updated_date',
                    },
                    direction: 'ASCENDING',
                },
                // startCursor     : string,
                // endCursor       : string,
                // offset          : number,
            },
        })
        .then(res => ({
            items: (res.batch.entityResults || [])
                .map(x => parseStation(x.entity)),
            haveMore: res.moreResults == 'NO_MORE_RESULTS',
            nextCursor: res.endCursor,
        }))
        .then(({ items }) => items);
