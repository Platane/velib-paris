try{
require('./math/math')
require('./blob/gridSplit')
require('./tube')
const assert = require('./assert')

if ( typeof process != 'undefined' && typeof process.exit == 'function' )
    assert.end()
        .then( success =>  process.exit( +!success ) )

}catch( e ){
    console.log ( e )
}
