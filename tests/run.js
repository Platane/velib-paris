

require('./math/math')
require('./blob/gridSplit')
require('./utils/stream')

setTimeout(
    () => {
        if ( typeof process != 'undefined' && typeof process.exit == 'function' )
            process.exit( +!require('./assert').success() )

        }
    , 1000
)
