

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

export const success = () => !fail
