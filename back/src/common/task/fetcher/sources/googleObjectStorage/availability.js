import {parseAvailability} from 'service/googleObjectStorage/parse'


const read = ( gos ) =>
    gos.runQuery({
        query : {
            kind    : [{name: 'stationAvailability'}],
            // order   : {
            //     property    : {
            //         name        : 'name',
            //     },
            //     direction   : 'ASCENDING',
            // },
            // startCursor     : string,
            // endCursor       : string,
            // offset          : number,
            limit           : 10,
        },
    })
    .then( res =>
        ({
            items       : ( res.batch.entityResults || [] )
                .map( x => parseAvailability( x.entity ) )
            ,
            haveMore    : res.moreResults == 'NO_MORE_RESULTS',
            nextCursor  : res.endCursor,
        })
    )


module.exports = read