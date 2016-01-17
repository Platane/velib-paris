
require('./math/math')
require('./blob/gridSplit')
require('./tube')

if ( typeof process != 'undefined' && typeof process.exit == 'function' )
    process.exit( +!require('./assert').success() )
