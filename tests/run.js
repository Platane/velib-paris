
require('babel/register')

require('./math/math')

if ( typeof process != 'undefined' && typeof process.exit == 'function' )
    process.exit( +!require('./assert').success() )
