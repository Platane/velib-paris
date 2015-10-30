
require('babel/register')

require('./math/math')
require('./blob/gridSplit')

if ( typeof process != 'undefined' && typeof process.exit == 'function' )
    process.exit( +!require('./assert').success() )
