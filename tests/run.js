
require('babel/register')

require('./math/math')

if ( typeof process != 'undefined' )
    process.exit( +!require('./assert').success() )
