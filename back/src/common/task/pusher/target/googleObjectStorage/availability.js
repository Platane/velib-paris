import {formatAvailability} from 'service/googleObjectStorage/parse'

const push = ( gos, batch ) =>
    gos.commit({
        mode      : 'NON_TRANSACTIONAL',
        mutations : batch
            .map( item =>
                ({ upsert: formatAvailability( item ) })
            )
    })

module.exports = push