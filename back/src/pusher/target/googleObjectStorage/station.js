import {formatStation} from 'service/googleObjectStorage/parse'


const push = ( gos, batch ) =>
    gos.commit({
        mode      : 'NON_TRANSACTIONAL',
        mutations : batch
            .map( item =>
                ({ upsert: formatStation( item ) })
            )
    })


module.exports = push