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
        console.log( res ) ||
        ( res.batch.entityResults || [] ).map( x => parseStation( x.entity ) )
    )


module.exports = read