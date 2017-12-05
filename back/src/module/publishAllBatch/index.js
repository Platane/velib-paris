import { run as publishBatch } from '../publishBatch'

type Options = {
    start_date?: number,
    end_date?: number,
}

const DAY = 1000 * 60 * 60 * 24

export const run = async (options?: Options = {}) => {

    const end_date = options.end_date || Date.now()
    const start_date = options.start_date || ( end_date - DAY * 30 )

    console.log(`publish batch between ${ new Date(start_date).toISOString() } - ${ new Date(end_date).toISOString() }`)

    for( let date = start_date ; date < end_date ; date += DAY )
        await publishBatch({ date })
}
