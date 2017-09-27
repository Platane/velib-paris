export const createFetcher = (fetchers: Array<() => Promise<*>>) => (
    params: any[]
) =>
    new Promise(resolve => {
        const pending = fetchers.map(() => 0)
        const dead = fetchers.map(() => false)
        const results = []

        const CONSECUTIVE_MAX = 3

        const loop = () => {
            const param = params.shift()

            // no param to fetch, or every fetcher is dead
            // and nothing is pending
            if (
                (!param || dead.every(Boolean)) &&
                fetchers.every((_, i) => pending[i] === 0)
            )
                return resolve(results)

            // no param, wait for pending fetchers to finish
            if (!param) return

            // grab next fetcher
            const i = fetchers.findIndex(
                (_, i) => !dead[i] && pending[i] < CONSECUTIVE_MAX
            )

            const fetch = fetchers[i]

            // no fetcher available
            if (!fetch) return

            pending[i]++

            fetch(param)
                .then(res => {
                    results.push(res)
                })
                .catch(err => {
                    console.log(`fetcher ${i} failed with`, err)

                    dead[i] = true
                })
                .then(() => {
                    pending[i]--
                    loop()
                })

            loop()
        }

        loop()
    })
