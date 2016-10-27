
const reporters = {
    
    'callback' : options =>
        err => options.callback( err )
    ,
    
    'console.log' : options =>
        options.monoline
            ? err => console.log( err.toString() )
            : err => console.log( err )
}

const createReporter = ( options = {} ) =>
    options.type in reporters
        ? reporters[ options.type ]( options )
        : reporters[ 'console.log' ]({})

module.exports = createReporter