export const split = (max: number, arr: Array<*>) =>
    Array.from({
        length: Math.ceil(arr.length / max)
    }).map((_, i) => arr.slice(i * max, (i + 1) * max))

export const splitAndExec = (
    max: number,
    arr: Array<*>,
    fn: (Array<*>) => Promise<*>
) => Promise.all(split(max, arr).map(fn))
