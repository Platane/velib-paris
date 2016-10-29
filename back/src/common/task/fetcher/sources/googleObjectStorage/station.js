import {parseStation} from 'service/googleObjectStorage/parse'


const read = ( gos ) =>
    gos.runQuery({
        query : {
            kind    : [{name: 'station'}],
            // order   : {
            //     property    : {
            //         name        : 'name',
            //     },
            //     direction   : 'ASCENDING',
            // },
        },
    })
    .then( res =>
        ({
            items       : ( res.batch.entityResults || [] )
                .map( x => parseStation( x.entity ) )
            ,
            haveMore    : res.moreResults == 'NO_MORE_RESULTS',
            nextCursor  : res.endCursor,
        })
    )


module.exports = read