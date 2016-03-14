

let ctx = []
let fail = false
export const context = {
    stack: message => {

        ctx.push( message ),

        console.log( '   '+ctx.join(' > ') )

        return context
    },

    pop: () => {
        ctx.pop()

        return context
    },

    reset: () => {
        ctx.length = 0

        return context
    },
}

export const assert = ( test, message = 'fail' ) => {
    if ( !test && (fail=true) )
        console.log( ' x '+[ ...ctx, message ].join(' > ') )

}

let pending = 0
export const asyncAssert = ( message = 'fail', delay = 500 ) => {

    const s = [ ...ctx, message ]

    let ended = null
    const f = () => {
        if ( ended )
            return

        pending --
        ended = true
        console.log( ' x '+s.join(' > ') )
        fail = true

        testEnd()
    }

    pending ++

    setTimeout( f, delay  )

    return ( test ) => {
        if ( test ) {
            pending --
            ended = true
            testEnd()
        } else
            f()
    }
}

const testEnd = () =>
    !pending && resolve && resolve( !fail )

let resolve
export const end = () =>
    new Promise( _resolve => {
        resolve = _resolve
        testEnd()
    })
