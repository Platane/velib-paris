import { promisify as promisify_ } from 'util'

export const promisify =
    promisify_ ||
    (fn => (...args) =>
        new Promise((resolve, reject) =>
            fn(...args, (err, res) => (err ? reject(err) : resolve(res)))
        ))
