

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

export const asyncAssert = ( message = 'fail', delay = 500 ) => {

    const s = [ ...ctx, message ]

    let ended = null
    const f = () => {
        if ( ended )
            return
        console.log( ' x '+s.join(' > ') )
        fail = ended = true
    }

    setTimeout( f, delay  )

    return ( test ) => test ? ended = true : f()
}

export const success = () => !fail
