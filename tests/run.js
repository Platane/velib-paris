

require('./math/math')
require('./blob/gridSplit')
require('./pipe')

if ( typeof process != 'undefined' && typeof process.exit == 'function' )
    process.exit( +!require('./assert').success() )
