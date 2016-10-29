export const wait = delay =>
    new Promise( resolve => setTimeout( resolve, delay ) )

export const timeout = ( promise, delay ) =>
    Promise.all([
        promise,
        wait( delay ).then( () => Promise.reject('timeout') )
    ])

export const throttle = ( delay, fn ) => {
    let cooldown = false
    let next     = false

    const loop = () => {

        cooldown = false

        if ( next ){
            next = false
            exec()
        }
    }

    const exec = () => {

        if ( !cooldown ) {

            cooldown = true

            fn()

            setTimeout( loop, delay )

        } else
            next = true
    }

    return exec
}

export const debounce = ( delay, fn ) => {
    let timeout

    return a => {
        clearTimeout( timeout )
        timeout = setTimeout( () => fn( a ) , delay )
    }
}
