module.exports = {}

;[
    require('./batcher'),
    require('./fromPromise'),
    require('./toPromise'),
]
    .forEach( o => {
        for( let i in o )
            module.exports[ i ] = o[ i ]
    })
